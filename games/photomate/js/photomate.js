navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
    console.dir(stream);
    var b;
    var v=document.createElement('video');
    v.srcObject=stream;
    v.onloadedmetadata=(e)=>{v.play();};
    console.dir(v.onloadedmetadata);
    document.body.appendChild(v);

    b=document.createElement('button');
    b.appendChild(document.createTextNode('Capture!'));
    b.style.margin='10px';
    b.style.padding='15px';
    b.onclick=(e)=>{
        console.log('canvas create');
        var c=document.createElement('canvas');
        c.width=1200;
        c.height=900;
        c.getContext('2d').drawImage(v,0,0,c.width,c.height);
        console.dir(c);

        console.log('anchor create');
        var a=document.createElement('a');
        a.download='photo.png';
        a.href=c.toDataURL('image/png');
        a.onclick = e => {
            console.log(`Click on anchor!`);
        }
        console.dir(a);
        console.log('anchor click');
        a.click();

        a=undefined;
        c=undefined;
    }

    document.body.appendChild(b);
    console.dir(b);
    console.dir(b.onclick);
});
