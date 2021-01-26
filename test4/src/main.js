import $ from 'jquery'

$(function(){
  $('ul li:odd').css('backgroundColor','yellow')
  $('ul li:even').css('backgroundColor', 'blue')
})