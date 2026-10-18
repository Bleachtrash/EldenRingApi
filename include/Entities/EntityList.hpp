#pragma once
#include <fstream>
#include <vector>
#include <iostream>
#include <rapidfuzz/fuzz.hpp>

template <typename T>
struct EntityList
{
    std::vector<T*> list;

    EntityList(){}
    EntityList(const char* json_file){
        std::ifstream File(json_file);
        std::string line;
        std::getline(File, line);

        crow::json::wvalue temp(crow::json::load(line));
        // std::cout << temp.size();
        for(int i = 0; i < temp.size(); i++)
            list.push_back(new T(temp[i]));
    }
    crow::json::wvalue JSON(int amount, int page_number){
        crow::json::wvalue response;
        if(amount*page_number > this->list.size())
            return response;
        for(int i = amount*page_number; i < this->list.size() && i < amount*page_number+amount; i++)
        {
            response[i-amount*page_number] = this->list[i]->JSON();
        }
        return response;
    }
    crow::json::wvalue JSON(int amount, int page_number, crow::query_string qstring)
    {
        EntityList<T> list_narrow;
        for(int i = 0; i < this->list.size(); i++)
        {
            bool good = true;
            bool check_query = true;
            // Use qstring to narrow results
            for(std::string key : qstring.keys())
            {
                if(key == "page")
                    continue;
                if(key.substr(4, key.size()) == "scaling" && this->list[i]->JSON()["scaling"].has(key.substr(0, 3))){
                    check_query = false;
                    // "A,B,C,D"
                    std::string list = qstring.get(key);
                    good = false;
                    std::string weapon_scaling = this->list[i]->JSON()["scaling"][key.substr(0, 3)].dump();
                    for(int i = 0; i < list.size(); i+=2){
                        if(weapon_scaling[1] == list[i])
                        {
                            // std::cout << "\n\nGood!\n\n";
                            good = true;
                        }
                    }
                }
                if(good && !check_query)
                    continue;
                if(!good)
                    break;
                // If key == name, fuzzy search
                if(key == "fuzzyName")
                {
                    good = rapidfuzz::fuzz::partial_ratio(list[i]->JSON()["name"].dump(), qstring.get(key)) > 70;
                    if(!good)
                        break;
                    continue;
                }
                // If query not in child json, skip
                if(check_query && !this->list[i]->JSON().has(key))
                {
                    good = false;
                    break;
                }
                // Do exact match for all other queries
                // Remove quotes from dumped strings
                std::string item_key_val = this->list[i]->JSON()[key].dump();
                if(item_key_val[0] == '\"')
                    item_key_val = item_key_val.substr(1, item_key_val.size()-2);
                // Check item value against query value
                good = item_key_val == qstring.get(key);
                if(!good)
                    break;

            }
            if(good)
                list_narrow.list.push_back(this->list[i]);
        }
        return list_narrow.JSON(amount, page_number);
    }
};