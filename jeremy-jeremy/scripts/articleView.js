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
// This function is called on our new html page because it is the piece of code we want to run only on that page for creating new articles
articleView.initNewArticlePage = () => {
  // DONE: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
  $('.tab-content').show();

  // DONE: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.
  $('#export-field').hide();

  $('#article-json').on('focus', function(){
    this.select();
  });

  // DONE: Add an event handler to update the preview and the export field if any inputs change.
  $('#new-form').on('change', function(){
    articleView.create();
  })

};

articleView.create = () => { //Event listener callback
  // DONE: Set up a variable to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview


  // DONE: Instantiate an article based on what's in the form fields:
  //Create a String for todays date to use if the published field is checked
  let todaysDate = new Date();

  let myDateString = (todaysDate.getFullYear() + '-'
           + ('0' + (todaysDate.getMonth()+1)).slice(-2) + '-'
           + ('0' + todaysDate.getDate()).slice(-2));

  let articleDraft = new Article ({
    title: $('#article-title').val(),
    category:  $('#article-category').val(),
    author: $('#article-author').val(),
    authorUrl:  $('#article-authorUrl').val(),
    publishedOn: $('#article-published').is(':checked') ? myDateString : '', //use ternary for published status (add one to month due to 0-11 months)
    body:  $('#article-body').val()
  })

  // DONE: Use our interface to the Handblebars template to put this new article into the DOM:
  $('#articles').html(articleDraft.toHtml()) //insert article into html of the articles ID (no need to clear, it's being overwriten)

  // TODO: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  // DONE: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  //Delete unnessary properties and show if form is filled out
  if (articleDraft.title && articleDraft.category && articleDraft.author && articleDraft.authorUrl && articleDraft.body) {
    $('#export-field').show();
  }
  delete articleDraft.daysAgo;
  delete articleDraft.publishStatus;
  $('#article-json').attr('placeholder', `{title: '${articleDraft.title}', category: '${articleDraft.category}', author: '${articleDraft.author}', authorUrl: '${articleDraft.authorUrl}', publishedOn: '${articleDraft.publishedOn}', body: '${articleDraft.body}'}`);


};

// COMMENT: Where is this function called? Why?
// It's called on the index page because we have pieces that we want to run for the index page and pieces that we want to run for our new page
articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml()));
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
