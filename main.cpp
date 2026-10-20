#include <crow.h>
#include <crow/middlewares/cors.h>
#include <Entities/Weapons.hpp>
#include <Entities/Armors.hpp>
#include <Entities/Talisman.hpp>

int main()
{
    crow::App<crow::CORSHandler> app;
    auto &cors = app.get_middleware<crow::CORSHandler>();

    EntityList<Weapon> WeaponsList("./data/weapons.json");    
    InitWeaponRoutes(&app, &WeaponsList);
    EntityList<Armor> ArmorsList("./data/armors.json");
    InitArmorRoutes(&app, &ArmorsList);
    EntityList<Talisman> TalismanList("./data/talismans.json");
    InitTalismanRoutes(&app, &TalismanList);

    app.port(8080).run();

    return 0;
}