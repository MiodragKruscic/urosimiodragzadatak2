const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
//let loadIDS = fs.readFileSync("ids.txt", "utf8").split(" ");
const ids = [];
const loadIDS = fs.readFileSync("ids.txt","utf-8").split(" ");


const _ = require('lodash/array');

console.log(loadIDS);


request("https://www.realitica.com/?cur_page=0&for=Najam&pZpa=Crna+Gora&pState=Crna+Gora&type%5B%5D=&lng=hr", (error,response,html) => {
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(html);
        let godNum = parseInt($("#left_column_holder > div > span").text().split(" ")[3].replace("ukupno",""),10);
        let impoNum = parseInt(godNum/20,10);
        for(let i = 0;i<impoNum;i++){
            request(`https://www.realitica.com/?cur_page=${i}&for=Najam&pZpa=Crna+Gora&pState=Crna+Gora&type%5B%5D=&lng=hr`, (error,response,html) => {
                if(!error && response.statusCode == 200){
                const $ = cheerio.load(html);
                $(".thumb_div a").each((index,item) => {
                    const link = $(item).attr("href").split("/")[5];
                    ids.push(link);
                    })
                    if(i==impoNum-1){
                        console.log(ids);
                     let what = _.difference(ids, loadIDS);
                     loop(what);
                    }
                }
            });
        }
    }
});


function write(ID){
    request(`https://www.realitica.com/hr/listing/${ID}`, (error,response,html) => {
        if(!error && response.statusCode == 200){
            let url = `https://www.realitica.com/hr/listing/${ID}`;
            const $ = cheerio.load(html);
            let variables = [];
            let variables2 = [];
            body = $("#listing_body").removeClass().text();
            function ok (string){
                return body.indexOf(string);
            }
            let array = [ok("Zemljište: "),ok("Adresa: "),ok("Prvi Red do Mora"),ok("Od Mora (m): "),ok("Parking Mjesta: "),ok("Vrsta: "),ok("Područje: "),ok("Energetski Razred: "),ok("Godina Gradnje: "),ok("Lokacija: "),ok("Spavaćih Soba: "),ok("Cijena: "),ok("Kupatila: "),ok("Novogradnja"),ok("Klima Uređaj"),ok("Stambena Površina: ")];
            array.sort(function(a, b){return a - b});
            array = array.filter(word => word > -1);
            for(let i=0;i<array.length-1;i++){
                variables.push(body.substring(array[i],array[i+1]))
            }
            variables.push(body.substring(array[array.length-1]).split("\n")[0]);
            let vrsta,podrucije,lokacija,bss=0,bk=0,cijena="neko nije stavio cijenu :O",sp=0,pm="none",om="none",zem="none",novogradnja=false,klima=false,slike="",naslov,id;
            variables.forEach((item,index) => {
                switch(item.split(":")[0]){
                    case "Vrsta":
                        vrsta = item.split(":")[1].replace(" ","");
                        break;
                    case "Zemljište":
                        zem = parseInt(item.split(":")[1].replace(" ",""));
                        break;
                    case "Područje":
                        podrucije = item.split(":")[1].replace(" ","");
                        break;
                    case "Lokacija":
                        lokacija = item.split(":")[1].replace(" ","");
                        break;
                    case "Cijena":
                        cijena = parseInt(item.split(":")[1].replace(" €",""),10);
                        break;
                    case "Spavaćih Soba":
                        bss = parseInt(item.split(":")[1].replace(" ",""),10);
                        break;
                    case "Kupatila":
                        bk = parseInt(item.split(":")[1].replace(" ",""),10);
                        break;
                    case "Stambena Površina":
                        sp = parseInt(item.split(":")[1].replace(" ",""),10);
                        break;
                    case "Novogradnja":
                        novogradnja = true;
                        break;
                    case "Klima Uređaj":
                        klima = true;
                        break;
                    case "Od Mora (m)":
                            om = parseInt(item.split(":")[1].replace(" ",""),10);
                            break;
                    case "Parking Mjesta":
                            pm = parseInt(item.split(":")[1].replace(" ",""),10);
                            break;

                    default:
                        console.log("wow");
                }
            })
  //          console.log(array);
    //        console.log(variables);
   //         console.log(vrsta);
            
  
           
            for(let i = 0;i<$("img").length;i++){
                if($("img")[i].attribs.src.split(".")[1] == "realitica")
                slike += ($("img")[i].attribs.src).toString() + " ";
            }
           naslov= $("h2").text();
           function ok2(string){
               return $("#aboutAuthor").text().indexOf(string);
           }

           let array2 = [ok2("Registarski broj: "),ok2("Oglasio: "),ok2("Mobitel verificiran u državi ME: "),ok2("Telefon: "),ok2("Mobitel: "),ok2("Kontaktiraj Oglašivača")];
           array2.sort(function(a, b){return a - b});
           array2 = array2.filter(word => word > -1);
           
           for(let i=0;i<array2.length-1;i++){
            variables2.push($("#aboutAuthor").text().substring(array2[i],array2[i+1]))
            }
            console.log(variables2);
            let oglasio,mobilni;
            variables2.forEach((item,index) => {
                switch(item.split(":")[0]){
                    case "Oglasio":
                        oglasio = item.split(":")[1].replace(" ","");
                        break;
                    case "Mobitel verificiran u državi ME":
                        mobilni = item.split(":")[1].replace(" ","");
                        break;
                    case "Telefon":
                        mobilni = item.split(":")[1].replace(" ","");
                        break;
                    case "Mobitel":
                        mobilni = item.split(":")[1].replace(" ","");
                        break;
                    default:
                        console.log("wow");
                }
            })
            //console.log(vrsta,podrucije,lokacija,cijena,bss,bk,novogradnja,klima,sp,mobilni,oglasio,slike)
           let date=($("#listMap").next().text().substring($("#listMap").next().text().indexOf("Zadnja Promjena: "),$("#listMap").next().text().indexOf("Tags: ")).replace("Zadnja Promjena: ","").replace(",",""));
           opis = (body.substring(body.indexOf("Opis: "),body.indexOf("Oglasio: ")).trim().replace(/\r?\n|\r/g," "));
           let finish = ((`${vrsta},${lokacija},${podrucije},${bss},${bk},${cijena},${sp},${zem},${pm},${om},${novogradnja},${klima},${naslov.replace("Kontakt Forma","").replace(","," ")},${oglasio},${mobilni},${ID},${date.replace("\n","")},${slike},${url},${opis.replace(/,/g," ")} \n`));
           console.log(oglasio);
           fs.appendFileSync("accomodation.csv",finish);
            fs.appendFileSync("ids.txt",ID + " ");
          
        }

    })
}


function loop(array){
    array.forEach((item,index)=>{
        write(item);
    })
}









