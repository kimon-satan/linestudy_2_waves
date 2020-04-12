/*
 Evolving Waves - accel/ deccel

*/


let line;
let sineGen;
let envs;
let showGraphs;
let dur;
let counter;

let ranges;


function setup()
{
  createCanvas(512,512);
  frameRate(60);

  let vertices = [];
  for(let i = 0; i < 100; i++)
  {
    vertices.push(createVector(-width/2 + i * width/100,0));
  }

  sineGens = [];

  line = new ShiftLine(vertices);
  sineGen = new SineGen(1,100,0);



  envs = {};
  ranges = {};
  //amp

  data  = calcSineEnv(100,0,PI,1,1,1);
  envs['amp'] = new EnvelopeData(data);
  ranges['amp'] = {min: 0, max: 75};

  //inc
  data  = calcSineEnv(100,0,PI,1,1.5,1);
  envs['inc'] = new EnvelopeData(data);
  ranges['inc'] = {min: PI/500, max: PI/25};

  //freq
  data  = calcSineEnv(100,0,PI,1,1,1.5);
  envs['freq'] = new EnvelopeData(data);
  ranges['freq'] = {min: 0.001, max: 0.25};


  dur = 20;
  counter = 0;




}

function draw()
{
  background(255);
  noFill();

  let p = (((millis()-counter)/1000)%dur)/dur;

  sineGen.amp = map( envs.amp.lin_value(p), 0,1,ranges['amp'].min, ranges['amp'].max);
  sineGen.freq =  map(envs.freq.lin_value(p), 0,1,ranges['freq'].min, ranges['freq'].max);
  let inc = map(envs.inc.lin_value(p), 0,1,ranges['inc'].min, ranges['inc'].max);
  sineGen.update(inc);


  //draw the shape
  stroke(0);
  translate(width/2,height/2);

  beginShape();
  for(let i = 0; i < 100; i++)
  {
    let v = line.calcVertex(i/100);
    let y = sineGen.value(i/100);
    vertex(v.x,v.y + y);
  }
  endShape();

  if(showGraphs)
  {

    randomSeed(0);
    let k = Object.keys(envs);

    for(let j = 0; j < k.length; j++)
    {

      //draw the envelope
      stroke(random(0,255),random(0,255),random(0,255));
      noFill();
      beginShape();
      for(let i = 0; i < 100; i++)
      {
        let y = -envs[k[j]].lin_value(i/100) * height/2;
        let x = -width/2 + i * width/100;
        vertex(x, y);
      }
      endShape();

    }

  }



}

function keyPressed()
{
  if(key == ' ')
  {
    counter = millis();
  }
  else if(key =='v')
  {
    showGraphs = !showGraphs;
  }
}
