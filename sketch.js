/*
 Evolving Waves
*/


let line;
let sineGen;
let envs;
let showGraphs;
let dur;
let counter;

function preload()
{

}


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

  data = calcSineEnv(100,0,PI,1,1.5);

  envs = {};

  envs['amp'] = new EnvelopeData(data);

  data = calcLinEnv(100,[0,1,0],[0.5,0.5])

  envs['inc'] = new EnvelopeData(data);

  dur = 20;
  counter = 0;

}

function draw()
{
  background(255);
  noFill();

  let p = (((millis()-counter)/1000)%dur)/dur;
  t = envs.amp.lin_value(p);

  sineGen.amp = t * 100;
  sineGen.freq =  map(t,0,1,0.001,0.25);

  let inc = map(envs.inc.lin_value(p), 0,1,PI/500,PI/50);
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
    let k = Object.keys(envs);

    for(let j = 0; j < k.length; j++)
    {
      //draw the envelope
      stroke(255,0,0);
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
