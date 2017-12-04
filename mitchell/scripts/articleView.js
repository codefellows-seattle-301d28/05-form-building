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
// This function is being called in index.html after all other scrips have run.
articleView.initNewArticlePage = () => {
  // DONE: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
  $('.tab-content').fadeIn();


  // TODO: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.

  $('#article-json').on('focus', function(){
    this.select(); //single click will highlight entire block
  });

  // TODO: Add an event handler to update the preview and the export field if any inputs change.
  
};

articleView.create = () => { //will be our callback
  // DONE: Set up a variable to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview
  $('#articles').clear();


  // TODO: Instantiate an article based on what's in the form fields: USE A TERNARY YOOOOOOOO to utilize checkbox after creating it
  let articleDraft = new Article({
    author: $('#article-author').val(),
    authorUrl: $('article-Url').val(),
    title: $('#article-title').val(), //comma b/c moving on to next part of object literal
    category: $('article-category').val(),
    body: $('article-body').val(),
    publishedOn: $('publishedOn').val()
  });


  // TODO: Use our interface to the Handblebars template to put this new article into the DOM:


  // TODO: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('pre code').each(function (i, block) {
    hljs.highlightBlock(block);
  });

  // TODO: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  //will need to .stringify YOOOOOOO
};

// COMMENT: Where is this function called? Why?
// This function is called on the index.html page. It allows for us to choose when and what to invoke instead of having things automatically load when the page loads. This allows for the ability to call functions in a certain order as desired, instead of having a certain function called before desired.
articleView.initIndexPage = () => { //used to be in $(document).ready() will function the same, but need to actually invoke initIndexPage (which is done on index.html at the very bottom) JUST A DIFFERENT WAY OF DOING IT. GIVES US SEPARATION OF CONCERNS. ACTUALLY HAVE TO INVOKE, NOT JUST .READY() WHICH INVOKES ON PAGE LOAD. By only using initIndexPage, only invokes the ones we need. 
  articles.forEach(article => $('#articles').append(article.toHtml()));
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
