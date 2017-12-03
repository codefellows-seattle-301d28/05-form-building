'use strict';

let articleView = {};

articleView.populateFilters = () => {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      let val = $(this).find('address a').text();
      let optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = () => {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = () => {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = () => {
  $('.main-nav').on('click', '.tab', function() {
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// COMMENT: Where is this function called? Why?
// PUT YOUR RESPONSE HERE
articleView.initNewArticlePage = () => {
  // DONE: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.

  articleView.handleMainNav();

  $('#new-form').on('change', function() {
    articleView.create();
  });


  // DONE: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.

  $('#article-json').on('focus', function(){
    this.select();
  });

  // TODO: Add an event handler to update the preview and the export field if any inputs change.
  // this is done i think
};

articleView.create = () => {
  // DONE: Set up a variable to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview


  // DONE: Instantiate an article based on what's in the form fields:
  let articleDraft = new Article({
    author: $('#article-author').val(),
    title: $('#article-title').val(),
    body: $('#post-body').val(),
    articleUrl: $('#article-authorUrl').val(),
    category: $('#article-category').val(),
    draft: $('#published').val(),
  })

  if($('#published').is(':checked')) {
    articleDraft.publishedOn = new Date();
    // console.log('i am checked');
  } else {
    // console.log('not checked');
    articleDraft.publishedOn = '';
  }


  // DONE: Use our interface to the Handblebars template to put this new article into the DOM:
  // use the .toHTML to push to the page. look at the past pages/ code to see how this works.

  $('#articles').html(''); //this resets the shown templete with nothing so it will not redo itself
  $('#articles').append(articleDraft.toHtml()); //this takes the new post and append it to new.html by using the Article prototype method .tohtml().

  // DONE: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  // TODO: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  // you will have to JSON stringify this so you can copy and paste as a string.

  var myJsonString = JSON.stringify(articleDraft)
  $('#article-json').val(myJsonString);
  // console.log('this is my string:', myJsonString);
};

// COMMENT: Where is this function called? Why?
// PUT YOUR RESPONSE HERE
// this is called at the bottom of the index.html page. its just like document.ready but just doing it with functions.


articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml()))
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
