
const reportChoice= [
    { color:"#000000", text: "aucun", value: 0 },
    { color:"#FF3300", text: "hors la loi", value: 1 },
    { color:"#FF6600", text: "hors charte", value: 2 },
    { color:"#FFCC00", text: "fake", value: 3 },
    { color:"#FFCC00", text: "troll", value: 4 },
    { color:"#66CC99", text: "hors sujet", value: 5 },
]

const evaluatChoice= [
    { color: '#aaaaaa', bgColor: '#aaaaaa30', text: "auncun", value: 0},
    { color: '#000000', bgColor: '#00000030', text: "sans intérêt", value: 1},
    { color: '#00bb00', bgColor: '#00bb0018', text: "intéressant", value: 2},
    { color: '#dd0000', bgColor: '#ff000020', text: "pas d'accord", value: 3},
    { color: '#0000dd', bgColor: '#0000ff20', text: "d'accord", value: 4},
]
const signalColor = '#ffff00'
const interestColor = '#00bb00'

 export { reportChoice, evaluatChoice, signalColor, interestColor }
