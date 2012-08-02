<?php
App::uses('HttpSocket', 'Network/Http');
App::import('Utility', 'Xml');
class MainController extends AppController {

	var $uses = array('Shop');

	public function index() {
		$ranges = array(
			1 => '300m',
			2 => '500m',
			3 => '1000m',
			4 => '2000m',
			5 => '3000m'
		);

		if (!empty($this->data)) {
			$this->set('post_data', $this->data['Shop']);
		}

		$api_param = array(
			'keyid' => Configure::read('GORUNAVI_KEY'),
		);
		$sock = new HttpSocket();

		$response_xml_cat_big = $sock->get(Configure::read('GORUNAVI_CATEGORYBIG_URL'), $api_param);
		$response_cat_big = Xml::toArray(Xml::build($response_xml_cat_big->body));
		$cat_bigs[0] = 'すべての業態'; 
		foreach($response_cat_big['response']['category_l'] as $cat_big) {
			$cat_bigs[$cat_big['category_l_code']] = $cat_big['category_l_name'];
		}

		$this->set(compact('ranges'));
		$this->set(compact('cat_bigs'));
}

	public function req() {

		$api_param = array(
			'keyid' => Configure::read('GORUNAVI_KEY'),
			'input_coordinates_mode' => 2,
			'coordinates_mode' => 2,
			'latitude' => $this->request->query['latitude'],
			'longitude' => $this->request->query['longitude'],
			'range' => 1,
		);

		$edit_parts = array('range', 'category_l');
		foreach ($edit_parts as $edit_part) {
			if(isset($this->request->query[$edit_part])) {
				$api_param[$edit_part] = $this->request->query[$edit_part];
			}
		}

		$sock = new HttpSocket();
		$response_xml = $sock->get(Configure::read('GORUNAVI_URL'), $api_param);
		$response = Xml::toArray(Xml::build($response_xml->body));
		$shop_info = array();
		foreach ($response['response']['rest'] as $shop) {
			$shop_info[] = array(
				'id' => $shop['id'],
				'name' => $shop['name'],
				'shop_image1' => $shop['image_url']['shop_image1'],
				'tel' => $shop['tel'],
				'url' => $shop['url'],
				'pc_coupon' => $shop['flags']['pc_coupon'],
				'latitude' => $shop['latitude'],
				'longitude' => $shop['longitude']
			);
		}
		Configure::write('debug', 0);  
		$this->autoRender = false;
		header('Content-type:application/json;charset=UTF-8');
		echo json_encode($shop_info);
	}
}
