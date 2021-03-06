const typesMessage = {    // bits array
  evaluate: 1,
  reply: 2,
  resume: 4,    // old; allways true
  report: 8,
  standard: 15,
  text: 16,     // for admin only
//  presentation: 256+ 2+ 8
}

function isType( type, question) {
  return (type & typesMessage[question]) === typesMessage[question]
}

export  { typesMessage, isType}
