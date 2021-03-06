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

function ic60 ( n, p){   // estimateur officiel à 20% & 80% pour t grand
	let t = n+p;
	let pr = p/t;
	return 0.8417*Math.sqrt( pr*(1-pr)/t)
}

function dycho( n, p, cible) {
	let deb=0;
	let fin=1;
	
	if( cible < 0.5) {
		deb = 0;
		fin = p/(n+p);
	} else {
		deb = p/(n+p);
		fin = p/(n+p); 
	
		let i=1
		let pr
		do {
			pr = prob( fin*(++i), n, p)
//			console.log('pr '+ pr)
		}
		while ((pr < cible) && (pr >0) );
//		deb = fin*(i-1);
		fin = min(1, fin*i);
//		console.log( i + ' '+ prob( fin, n, p));

//		stroke(0, 0, 255); strokeWeight(4);  
//		point( fin*400, 400-prob( fin, n, p)*400);
	}
	let mid
	let pr;
	do { 	
		mid = (fin+deb)/2;
		pr = prob( mid, n, p);
		if( pr < cible) {
			deb = mid;
		} else {
			fin = mid;
		}
	} while( fin -deb > 0.001);
	return mid;
}


function trace(n, p) {
	for( let i=0; i<400; i++) {
		point( i, 400-prob( i/400, n,p)*400);
	}
	let t = n+p
	let m20 = dycho( n, p, 0.2);
	let m80 = dycho( n, p, 0.8);
	let ic20 = (p/t- ic60(n, p))
	let ic80 = (p/t+ ic60(n, p))
	stroke(0, 255, 0); strokeWeight(4);  // mon estimateur (en vert) à +/-20% pour t faible
	point( m20*400, 320);
	point( m80*400, 80);
	
	
	
	stroke(255, 0, 0); 					// estimateur officiel (en rouge) à +/-20% pour t grand
	point( (p/t- ic60(n, p))*400, 320);
	point( (p/t+ ic60(n, p))*400, 80);
	stroke(255); strokeWeight(1);
	
	
	print( Math.abs( m20 - ic20)+ ' ' + Math.abs( m80 - ic80));
	
}


function setup() {
  createCanvas(400, 400);
  background( bg);
  stroke(255); strokeWeight(1);
  
  line(0,80, 400, 80);
  line(0,320, 400, 320);

  let n=37
  let p=12
  trace(n,p);
  console.log( 'd20: '+ dycho( n, p, 0.2));
  console.log( 'd80: '+ dycho( n, p, 0.8));
  
//  return
	let max = 170;
	let min = -1;
	for( let p=1; p<max; p++) {
		if( min > -1) {
			console.log( "min : "+ min+ ' '+ (p-1));
		}
		console.log( 'p = ' + p+ ' max = '+ max);
		min = -1;
		for( let n=p; n<max, n+p<170; n++) {
			let t = n+p;
			let dycho20 = dycho( n, p, 0.2);
			let dycho80 = dycho( n, p, 0.8);
			let ic20 = p/t- ic60(n, p);
			let ic80 = p/t+ ic60(n, p);
			if( Math.abs(prob( dycho80, n, p) - 0.8)>0.2) {
				max =n;
				break;
			}
			let ok = false;
			if( (Math.abs(dycho20 - ic20) < 0.02)
				&& (Math.abs(dycho80 - ic80) < 0.02)){
				ok =true;
			}
			if( ok) {
				if( min === -1) {
					min = n;
				}
			} else {
				if( min > 0) { 
					min = -1
				}
			}
		}	
	}
}

