const search_bar = document.getElementById("search");

const weapon_type_option = document.getElementById("weapon_type");
const scaling_option = document.getElementById("scaling_options");

const options = document.getElementById("options");
const apply_options_button = document.getElementById("apply_options");
const clear_options_button = document.getElementById("clear_options");

const items = document.getElementById("items");

const next_button = document.getElementById("next_button");
const prev_button = document.getElementById("prev_button");

for(input of document.getElementsByTagName("input")){
    if(input.type == "text")
        input.value = "";
    input.checked = false;
}
for(select of document.getElementsByTagName("select")){
    select.value = "";
}

base_addr = "http://localhost:8080";

const damage_types = ["physical", "magic", "fire", "lightning", "holy", "critical"];
const stats = ["str", "dex", "int", "fai", "arc"];


function get_item_info(item){
    let item_info = document.createElement("div");
    item_info.className = "item_info";

    let row1 = document.createElement("div");
    row1.className = "info_row";

    let attack_power = document.createElement("div");
    attack_power.className = "info_column";
    attack_power.appendChild(document.createElement("p"));
    attack_power.children[0].innerHTML = "Attack Power";
    attack_power.children[0].className = "info_title";


    let guard = document.createElement("div");
    guard.className = "info_column";
    guard.appendChild(document.createElement("p"));
    guard.children[0].innerHTML = "Guard";
    guard.children[0].className = "info_title";


    for(damage_type of damage_types){
        let power_row = document.createElement("div");
        power_row.className = "info_row";
        let d_type = document.createElement("p");
        d_type.innerHTML = damage_type;
        let d_value = document.createElement("p");
        d_value.style.marginLeft = "auto";
        d_value.innerHTML = item.damage[damage_type];

        power_row.appendChild(d_type);
        power_row.appendChild(d_value);
        attack_power.appendChild(power_row);

        if(damage_type == "critical")
            damage_type = "boost";
        let guard_row = document.createElement("div");
        guard_row.className = "info_row";
        let g_type = document.createElement("p");
        g_type.innerHTML = damage_type;
        let g_value = document.createElement("p");
        g_value.style.marginLeft = "auto";
        g_value.innerHTML = item.guard[damage_type];
        guard_row.appendChild(g_type);
        guard_row.appendChild(g_value);
        guard.appendChild(guard_row)
    }
    row1.appendChild(attack_power);
    row1.appendChild(guard);
    item_info.appendChild(row1);
    
    let row2 = document.createElement("div");
    row2.className = "info_row";

    let scaling = document.createElement("div");
    scaling.className = "info_column";
    scaling.appendChild(document.createElement("p"));
    scaling.children[0].innerHTML = "Scaling";
    scaling.children[0].className = "info_title";
    let scaling_content = document.createElement("div");
    scaling_content.className = "info_row";
    scaling.appendChild(scaling_content);

    let requires = document.createElement("div");
    requires.className = "info_column";
    requires.appendChild(document.createElement("p"));
    requires.children[0].innerHTML = "Requires";
    requires.children[0].className = "info_title";
    let requires_content = document.createElement("div");
    requires_content.className = "info_row";
    requires.appendChild(requires_content);
    for(stat of stats){
        let scaling_column = document.createElement("div");
        scaling_column.className = "info_column";
        let s_type = document.createElement("p");
        s_type.innerHTML = stat;
        s_type.style.fontSize = "x-small";
        let s_val = document.createElement("p");
        s_val.innerHTML = item.scaling[stat];
        scaling_column.appendChild(s_type);
        scaling_column.appendChild(s_val);
        scaling_content.appendChild(scaling_column);

        let requires_column = document.createElement("div");
        requires_column.className = "info_column";
        let r_type = document.createElement("p");
        r_type.innerHTML = stat;
        r_type.style.fontSize = "x-small";
        let r_val = document.createElement("p");
        r_val.innerHTML = item.requirements[stat];
        if(!r_val.innerHTML)
            r_val.innerHTML = "-";
        requires_column.appendChild(r_type);
        requires_column.appendChild(r_val);
        requires_content.appendChild(requires_column);

        if(stat == "str"){
            scaling_column.style.borderLeft = "none";
            requires_column.style.borderLeft = "none";
        }
    }
    row2.appendChild(scaling);
    row2.appendChild(requires);
    item_info.appendChild(row2);
    return item_info;
}

let page_number = 0;
let api_page_number = 0;
async function get_weapons(page){
    let addr = base_addr + "/weapons?page="+(page? page : 0);
    let test_addr = base_addr + "/weapons?page="+(page? page+1 : 0+1);
    if(search_bar.value){
        addr += "&fuzzyName="+search_bar.value;
        test_addr += "&fuzzyName="+search_bar.value;
    }
    if(weapon_type_option.value){
        addr += "&weapon_type="+weapon_type_option.value;
        test_addr += "&weapon_type="+weapon_type_option.value;
    }
    if(options.querySelector("#upgrade_material").value){
        addr += "&upgrade_material="+options.querySelector("#upgrade_material").value;
        test_addr += "&upgrade_material="+options.querySelector("#upgrade_material").value;
    }
    for(aspect of stats){
        let scaling_values = "";
        for(sc of scaling_option.querySelector("#"+aspect+"_scaling").querySelectorAll("input")){
            if(!sc.checked)
                continue;
            scaling_values += sc.value + ",";
        }
        if(scaling_values.length){
            scaling_values = scaling_values.substring(0, scaling_values.length-1);
            addr += "&"+aspect+"_scaling="+scaling_values;
            test_addr += "&"+aspect+"scaling="+scaling_values;
            console.log(addr);
        }
    }
    const res = await fetch(addr);
    const json = await res.json();
    const test_res = await fetch(test_addr);
    const test_json = await test_res.json();
    next_button.style.display = test_json? "" : "none";
    prev_button.style.display = page? "" : "none";
    for(i of json){
        let item = document.createElement("div");
        item.className = "item";
        let item_name = document.createElement("h2");
        item_name.innerHTML = i.name;
        let item_link = document.createElement("a");
        item_link.href = "https://eldenring.wiki.fextralife.com/" + i.name;
        item_link.appendChild(item_name);
        item.appendChild(item_link);
        let img = document.createElement("img");
        img.className = "item_image";
        img.src = i.image;
        item.appendChild(img);
        item.appendChild(get_item_info(i));
        items.appendChild(item);
    }
}
async function search(){
    next_button.style.display = "none";
    prev_button.style.display = "none";
    items.innerHTML = "";
    if(true){
        await get_weapons(page_number);
    }
}
let scaling_values = ['A', 'B', 'C', 'D', 'E', 'F'];
function fill_scaling_options(){
    for(row of scaling_options.querySelectorAll("tr")){
        for(scaling_value of scaling_values){
            let label = document.createElement("label");
            label.innerHTML = scaling_value;
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = scaling_value;
            label.prepend(checkbox);
            row.appendChild(label);
        }
    }
}
fill_scaling_options();

function clear_options(){
    for(option_input of options.querySelectorAll("input"))
        option_input.checked = false;
    for(option_select of options.querySelectorAll("select"))
        select.value = "";
}

window.addEventListener("load", search);
apply_options_button.addEventListener("click", function(){
    page_number = 0;
    search();
});
clear_options_button.addEventListener("click", clear_options);
search_bar.addEventListener("change", function(){
    page_number = 0;
    search();
});
next_button.addEventListener("click", function(){
    page_number++;
    search();
});
prev_button.addEventListener("click", function(){
    page_number--;
    search();
});