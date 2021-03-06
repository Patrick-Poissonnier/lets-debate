const bg = 0;			// background grey
const animation = 0 	// 0, 1, 2 ou 3

function tr( i) {		// non linéarités des couleurs pour croisements
	let k = -i+180;		// k de 240 à 0
	
	if( k<120 )
		return k+sq(sin(-k* 360/240))*50
	else
		return k
}


function pnt( c, j, r) { 	// 1 point
  const sj = sin(j);
  const cj = cos(j);
	
  stroke( c%360, (r-45)/1.33, 100); strokeWeight(20);
  point( r*sj, r*cj );
  
  stroke(0, 0, bg); strokeWeight(16);
  point( (r-28)*sj, (r-28)*cj );
  point( (r+26)*sj, (r+26)*cj );
}

function trace( color) {	// 3 arcs de cercle 
  let i, r, tric;
  
  for(i=-60; i<180; i++) {	
	r = 75*sin( i*3/2)+100;
	tric = tr(i)+ color;

	pnt( tric, i, r);
	pnt( tric+ 120, i+240, r);
	pnt( tric+ 240, i+480, r);
  }
}

function setup() {
  createCanvas(400, 400);
  angleMode( DEGREES);
  colorMode( HSB, 360, 100, 100);
  background( 0, 0, bg);
  
  if( animation ) return;
  
  translate(200, 200);
  scale( 1, -1);
  rotate( 30);
  trace( 0);
}
  

const delta = 2;
let a = 0;
let sgn = animation -2;
let col = 0
function draw() {
 if( !animation)
	 return
 
  a += delta;
  col += (sgn *delta +360)% 360
  translate(200, 200);
  rotate( a);
  trace( col );
}