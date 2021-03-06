const bg = 0;			// background black

var _fact = [];
function factorial (n) {
  if (n === 0 || n === 1) 
	return 1;
  if (_fact[n] )
    return _fact[n];
  return _fact[n] = factorial(n-1) * n;
}

function Cnp( n, p) {
	return factorial( n) / (factorial(p) * factorial(n-p));
}

function prob( x, n, p) {
	let res = 0;
	let sgn = 1;
	for( let i=0; i<=n; i++) {
		res += sgn * Math.pow( x, p+1+i)/( p+1+i)* Cnp( n, i);
		sgn *= -1;
	}
	return Cnp( n+p, n)* res* (n+p+1);
}

function ic50 ( n, p){   // estimateur officiel à +/-25% pour t grand
	let t = n+p;
	let pr = p/t;
	return 0.675*Math.sqrt( pr*(1-pr)/t)
}

function trace(n, p) {
	for( let i=0; i<400; i++) {
		point( i, 400-prob( i/400, n,p)*400);
	}
	let t = n+p;
	let sgn = Math.sign( n-p);
	line((p/t -0.05+Math.min( 0, sgn*0.5/t))*400, 0, (p/t -0.05+Math.min( 0, sgn*0.5/t))*400, 400);
	line((p/t +0.05+Math.max( 0, sgn*0.5/t))*400, 0, (p/t +0.05+Math.max( 0, sgn*0.5/t))*400, 400);
	
	let p1x = Math.max(0, p/t -0.05+Math.min( 0, sgn*0.5/t));
	let p1y = prob( p1x, n, p);
	
	let p2x = Math.min(1, p/t + 0.05+Math.max( 0, sgn*0.5/t));
	let p2y = prob( p2x, n, p);
	
	let A = (p2x-p1x)/(p2y-p1y);
	let B = p1x - p1y*A;
	line( B*400, 400, (A+B)*400, 0);
	
	stroke(0, 255, 0); strokeWeight(4);  // mon estimateur à +/-25% pour t faible
	point( (0.25*A+B)*400, 300);
	point( (0.75*A+B)*400, 100);
	
	stroke(255, 0, 0); 					// estimateur officiel à +/-25% pour t grand
	point( (p/t- ic50(n, p))*400, 300);
	point( (p/t+ ic50(n, p))*400, 100);
	stroke(255); strokeWeight(1);
	
}


function setup() {
  createCanvas(400, 400);
  background( bg);
  stroke(255); strokeWeight(1);
  
  line(0,100, 400, 100);
  line(0,300, 400, 300);

  trace(10,2);
}

