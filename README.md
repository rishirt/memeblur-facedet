#Face Detection with Node.js 

The application uses the open-source [OpenCV](http://opencv.org/) library, specifically the [Viola-Jones object detection algorithm](https://en.wikipedia.org/wiki/Viola%E2%80%93Jones_object_detection_framework). 

In order to run OpenCV from Node.js, it uses the [nodejs-opencv](https://www.npmjs.com/package/opencv) package.



##Instruction

```bash
git clone https://github.com/rishirt/memeblur-facedet .
cd memeblur-facdet
vagrant up
vagrant ssh
npm install
node index.js 
```

Then visit:

```
http://192.168.10.10:8080/
```