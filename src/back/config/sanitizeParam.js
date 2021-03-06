const configSanitzeHtml = {
    allowedTags: [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5','h6',
     'b', 'i', 'em', 'strong', 
     'span', 'a', 'ul', 'ol', 'li', 'sub', 'img' ],
    allowedAttributes: {
      '*': [ 'style',] ,
      'a': [ 'href', 'title' ],
      'img': [ 'src', 'alt', 'width', 'hight'],
    },
  }

exports.default = { configSanitzeHtml}