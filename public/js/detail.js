// 进行回复
$(function () {
	$('.comment').click(function (e) {
		// 拿到该节点的dom
		var target = $(this);
		var toId =  target.data('tid');
		var commentId =  target.data('cid');

		// 保证可以对楼下的回复进行再次回复
		if ($('#toId').length > 0) {
			$('#toId').val(toId)
		} else {
			$('<input>').attr({
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',
				value: toId
			}).appendTo('#commentForm');
		} 
		if ($('#commentId').length > 0) {
			$('#commentId').val(commentId)
		} else {
			$('<input>').attr({
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',
				value: commentId
			}).appendTo('#commentForm');
		}
		
	}) 
})