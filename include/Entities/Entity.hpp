#pragma once
#include <crow.h>

struct Entity
{    
    int id;
    Entity(int id)
    {
        this->id = id;
    }
    Entity() : Entity(0){}
    virtual crow::json::wvalue JSON()
    {    
        return crow::json::wvalue();
    }
};

crow::json::wvalue list_to_json(std::vector<Entity*> list)
{
    crow::json::wvalue response;
    for(int i = 0; i < list.size(); i++)
    {
        response[std::to_string(i)] = list[i]->JSON();
    }
    return response;
}