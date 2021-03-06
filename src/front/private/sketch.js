const bg = 0;			// background grey
const animation = 3 	// 0, 1, 2 ou 3

function tr( i) {		// non linéarités des couleurs pour croisements
	let k = -i+180;		// k de 240 à 0
	
	if( k<120 )
		return k+sq(sin(-k* 360/240))*50
	else
		return k
}


function pnt( c, i, r, effac) { 	// 1 point
  const si = sin(i);
  const ci = cos(i);
	
  if( effac) {
	stroke(0, 0, bg); strokeWeight(16);
	point( (r-27)*si, (r-27)*ci );
	point( (r+26)*si, (r+26)*ci );
  }

  stroke( c%360, r/1.75, 100); strokeWeight(20);
  point( r*si, r*ci );
 }

function trace( color) {	// 6 arcs de cercle 
  let i, r, tric;
  
  for(i=60; i>-60; i--) {	
	r = 75*sin( i*3/2)+100;
	tric = tr(i) + color;
	
	pnt( tric, i, r, false);
	pnt( tric+ 120, i+240, r, false);
	pnt( tric+ 240, i+480, r, false);
  }		
  for(i=60; i<180; i++) {	
	r = 75*sin( i*3/2)+100;	
	tric = tr(i)+ color;
	
	pnt( tric, i, r, true);
	pnt( tric+ 120, i+240, r, true);
	pnt( tric+ 240, i+480, r, true);
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
let col = 0;

function draw() {
 if( !animation)
	 return
 
  clear();
  background( 0, 0, bg);
  a += delta;
  col += (sgn *delta +360)% 360
  translate(200, 200);
  rotate( a);
  trace( col );
}