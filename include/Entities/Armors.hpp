#pragma once
#include <crow.h>
#include <Entities/EntityList.hpp>

struct Armor{
    crow::json::wvalue json;
    Armor(){};
    Armor(crow::json::wvalue json){
        this->json = crow::json::wvalue(json);
    }
    crow::json::wvalue JSON(){
        return this->json;
    }
};

void InitArmorRoutes(crow::App<crow::CORSHandler> *app, EntityList<Armor> *ItemsList)
{
    // Add a limit to number of items on a page
    int item_limit = 20;
    CROW_ROUTE((*app), "/armor")([ItemsList, item_limit](const crow::request req){
        int page = 0;
        try{
            page = std::stoi(req.url_params.get("page")? req.url_params.get("page") : "0");
        }catch(std::invalid_argument &e){}

        return ItemsList->JSON(item_limit, page, req.url_params);    
    });
}