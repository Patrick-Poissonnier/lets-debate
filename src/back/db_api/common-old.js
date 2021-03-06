const initReport = {
    outlaw: 0,
    outCharter: 0,
    offTopic: 0,
    troll: 0,
    fake: 0

  }
//  Object.freeze(initReport)
  const txtInitReport = JSON.stringify( initReport).replaceAll('"', '')

  const initInterestMessage = {
    noInterest: 0,
    interest: 0,
    disagree: 0,
    agree: 1,
//    nextStat: 2,
  }
  const initInterestUser = {
    noInterest: 0,
    interest: 1,
//    nextStat: 2,
  }
//  Object.freeze(initInterest)
  const txtInitInterestMessage = JSON.stringify( initInterestMessage).replaceAll('"', '')
  const txtInitInterestUser = JSON.stringify( initInterestUser).replaceAll('"', '')
  
  module.exports = {txtInitReport, txtInitInterestMessage, txtInitInterestUser}