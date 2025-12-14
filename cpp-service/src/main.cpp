#include <iostream>
#include "httplib.h"
using namespace std;
using namespace httplib;

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
        
        //echo the same bytes back for now, just for verifying purposes 
        res.set_content(req.body,"application/octet-stream");

        cout<<"c++ response sent " << endl;
    });

    cout<<"C++ service running on port 8000...."<<endl;

    server.listen("0.0.0.0",8000);

    return 0;
}