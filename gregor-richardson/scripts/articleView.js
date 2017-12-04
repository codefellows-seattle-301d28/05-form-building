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
// This is called on new.html to setup our listeners for publishing articles
articleView.initNewArticlePage = () => {
  // DONE: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
  $('.tab-content').show();

  // DONE: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.

  $('#article-json').on('focus', function(){
    this.select();
  });

  // DONE: Add an event handler to update the preview and the export field if any inputs change.
  $('#newArticleForm').on('change', ()=>{
    // console.log('form changed');
    articleView.create();
  });
};
//gregor note: This is eventlistener used for callback to handle info from form.
articleView.create = () => {
  // DONE: Set up a variable to hold the new article we are creating.
  let articleDraft;
  // DONE: Clear out the #articles element, so we can put in the updated preview
  $('#articles').html('');

  // DONE: Instantiate an article based on what's in the form fields:
  articleDraft = new Article({
    'title' : $('#articleTitle').val(),
    'body' : $('#articleBody').val(),
    'author' : $('#articleAuthor').val(),
    'authorUrl' : $('#authorURL').val(),
    'category' : $('#articleCategory').val(),
    'publishedOn' : formatDate()
  });


  function formatDate() {
    let d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');

  }
  // DONE: Use our interface to the Handblebars template to put this new article into the DOM:
  // DONE: Use Handlebars to render your articles. Get your template from the DOM and "compile" your template with Handlebars.
  let template = $('#article-template').html();
  // console.log(template,'value of template');
  let handlebars = Handlebars.compile(template);
  console.log(articleDraft,'value of draft now');
  let compiledHandlebars = handlebars(articleDraft);
  $('#articles').append(compiledHandlebars);
  // console.log(compiledHandlebars, 'compiled handlebars');
  
  // DONE: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  // DONE: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  console.log('value of articleDraft before json', articleDraft);
  let stringifyResults = (JSON.stringify(articleDraft));
  console.log(stringifyResults,'stringified');
  console.log(marked(stringifyResults),'marked');
  // $('#article-json').html(marked(stringifyResults));
  $('#article-json').val(stringifyResults);

  $('#article-export').show();
};

// COMMENT: Where is this function called? Why?
// This is called in index..html to run our event listeners on the page
articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml()));
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};