<?php echo $this->Html->script(array('map')); ?>
<h1>ぐるなびマップ</h1>
<form name = "fm">
検索範囲：
<?php echo $this->Form->select('Shop.range', $ranges, array('name' => 'range', 'empty' => false)); ?>
業態：
<?php echo $this->Form->select('Shop.cat_big', $cat_bigs, array('name' => 'cat_big', 'empty' => false)); ?>
<input type="button" name="submit" value="submit" onclick="asyncSend()" />
</form>
<div id="result"></div>
<?php for($i = 0; $i <= 10; $i++) { ?>
	<div id="shopinfo<?php echo $i; ?>"></div>
<?php } ?>

<div id="map_canvas"></div>
