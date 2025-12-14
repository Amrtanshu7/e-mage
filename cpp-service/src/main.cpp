#include <iostream>
#include "httplib.h"
#include <opencv2/opencv.hpp>
#include <vector>


using namespace std;
using namespace httplib;
using namespace cv;


int main()
{
    cout<<"C++ microservice placeholder running ... \n";

    Server server; //define the server like app in express

    server.Get("/health",[](const Request&, Response& res){
        res.set_content("C++ service is running!","text/plain");
    });

    server.Post("/process-image",[](const Request& req,Response& res){

        cout<<"C++ received POST /process-image image data"<<endl;
        cout<<"Bytes received :" << req.body.size() <<endl;

        //step 1: convert request body to buffer 

        vector<uchar> inputBytes(req.body.begin(),req.body.end());

        //step 2: Decode image from bytes

        Mat inputImage = imdecode(inputBytes,IMREAD_COLOR); 

        if(inputImage.empty())
        {
            cout<<"failed to decode image"<<endl;

            res.status = 400;
            res.set_content("Invalid image data","text/plain");
            return;
        }
        
        cout<<"image decoded successfully"<<endl;

        //step 3: Convert image to grayscale

        Mat grayImage;
        cvtColor(inputImage,grayImage,COLOR_BGR2GRAY);

        //step 4: encode processed image back to bytes 

        vector<uchar> outputBytes;
        imencode(".jpg",grayImage,outputBytes);

        cout<<"processed image bytes:"<<outputBytes.size() << endl;

        //step 5:send the binary response

        res.set_content(reinterpret_cast<const char*>(outputBytes.data()),
                        outputBytes.size(),
                        "application/octet-stream"
                    );

        cout<<"c++ response sent " << endl;
    });

    cout<<"C++ service running on port 8000...."<<endl;

    server.listen("0.0.0.0",8000);

    return 0;
}