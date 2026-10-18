# Elden Ring Api
An open CORS API containing information for Elden Ring's items sourced from https://eldenring.wiki.fextralife.com/Elden_Ring_Wiki

## Building and Running
1. Clone repository ```git clone https://github.com/Bleachtrash/EldenRingApi```
2. Build ```g++ main.cpp -o main -Iinclude -static-libgcc -static-libstdc++ -lws2_32 -lwsock32```
3. Run
4. The API is hosted on port :8080

## Json Response
Upon being requested, the API will respond with JSON in this form
```JSON
{
  "item_count": 300
  "items": [...]
}
```

## Endpoints
### /armor
Contains information about all armor pieces. The following is an example of an armor object's json
```JSON
{
  "name": "Broken Gold Mask",
  "type": "Head Armor",
  "image": "https://static0.fextralifeimages.com/file/eldenring/a/a4/Golden-tattoo-Mask-elden-ring-wiki-guide.png",
  "weight": 2.0,
  "damage_negation": {
    "physical": 2.0,
    "fire": 4.0,
    "lightning": 4.2,
    "holy": 4.4,
    "magic": 4.2
  },
  "resistance": {
    "poise": 30,
    "focus": 29,
    "robustness": 7,
    "immunity": 20
  }
}
```
### /weapons
Contains information about all weapons. The following is an example of an weapon object's json
```JSON
{
    "name": "Fire Knight's Shortsword",
    "weapon_type": "Dagger",
    "image": "https://static0.fextralifeimages.com/file/eldenring/a/ae/Fire_knights_shortsword_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png",
    "upgrade_material": "Smithing Stones",
    "weight": 2,
    "dmg1": "Slash",
    "dmg2": "Pierce",
    "skill": "Quickstep",
    "fpcost": "3",
    "passive": "-",
    "guard": {
        "boost": 15,
        "lightning": 18,
        "fire": 31,
        "holy": 18,
        "magic": 18,
        "physical": 32
    },
    "scaling": {
        "arc": "-",
        "fai": "D",
        "int": "-",
        "dex": "D",
        "str": "D"
    },
    "requirements": {
        "arc": null,
        "fai": 12,
        "int": null,
        "dex": 13,
        "str": 8
    },
    "damage": {
        "critical": 110,
        "lightning": 0,
        "fire": 22,
        "holy": 0,
        "magic": 0,
        "physical": 75
    }
}
```

## General Parameters
Every endpoint can be queried with the parameter fuzzyName[fuzzy_name] string, which uses fuzzy searching to match fuzy_name with an item's name. Every endpoint may also use any of an item's first-level values as a parameter using exact string matching (e.g. /weapons?upgrade_material=Smithing Stones).
## Endpoint Specific Parameters
Some objects have information that would be useful, but otherwise impossible to query. Thus, some endpoint specific Parameters have been made
### /weapons
Weapons may be queried using their attribute scaling using the following parameters
1. str_scaling
2. dex_scaling
3. int_scaling
4. fai_scaling
5. arc_scaling

Each of these parameters takes in a comma seperated list of letters A-F.

Items are then returned based on if their selected attribute's scaling matches *any* of the specified values.

When using multiple values an item must have a scaling value contained in each of the lists.

Example 1: /weapons?str_scaling=A,B,C will return any weapon who's scaling.str value is "A", "B", or "C".

Example 2: /weapons?str_scaling=A,B&dex_scaling=C,D will return any weapon who's scaling.str value is "A" or "B" and scaling.dex value is "C" or "D".

## Acknowledgements
This project relies on the [CrowCPP library](https://github.com/CrowCpp/Crow), the [Asio library](https://github.com/CrowCpp/Crow), as well as the [Elden Ring Fextralife wiki](https://eldenring.wiki.fextralife.com/Elden_Ring_Wiki).