export const MapOptions: any = {
  defaultTitle: 'Vilniaus miesto interaktyvūs žemėlapiai',
  mapOptions: {
    basemap: 'dark-gray',
    extent: {
      "xmin": 555444.210800001,
      "ymin": 6051736.22,
      "xmax": 606967.016199999,
      "ymax": 6076388.28,
      "spatialReference": {
        "wkid": 3346
      }
    },
    staticServices: {
      //for basemaps const check basemaps.ts in map-widgets folder
      basemapUrl: 'https://zemelapiai.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/Vilnius_basemap_1000/MapServer',
      basemapDarkUrl: 'https://atviras.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/Vilnius_basemap_dark_LKS/MapServer',
      ortofotoUrl: 'https://zemelapiai.vplanas.lt/arcgis/rest/services/Baziniai_zemelapiai/ORT5LT_2016/MapServer',
      basemapEngineeringUrl: 'https://zemelapiai.vplanas.lt/arcgis/rest/services//Baziniai_zemelapiai/Vilnius_Inzinerija/MapServer',
      geometryUrl: 'https://zemelapiai.vplanas.lt/arcgis/rest/services/Utilities/Geometry/GeometryServer',
      //printServiceUrl: "https://zemelapiai.vplanas.lt/arcgis/rest/services/ITV_teritorijos/ITV_teritorijos_spausdinimas/GPServer/Export%20Web%20Map"
      printServiceUrl: 'https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Interaktyvus_Default/GPServer/Export%20Web%20Map',
      extract3DGP: {
        url: 'https://atviras.vplanas.lt/arcgis/rest/services/Geoprocesingai/3DEXPORT_LIMITED/GPServer/3D_OBJ_GP_su_PIKET_LIMIT',
        params: {
          // Geoprocessor input name of the service
          name: 'Teritorija'
        }
      },
      //allLayers group service for displaying all layers
      commonMaps: 'https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Bendras/MapServer'
    },
  },
  themes: {
    teritory: {
      production: true, //if theme is ready for production
      name: "Planavimas ir statyba", //theme name
      //id: "teritory-planning", //theme id class and theme URL query name
      description: "Teritorijų planavimo ir statybų temoje rasite informaciją apie šių sluoksnių grupes: kaimynijos, bendrasis planas, teritorijų planavimo registras, detalieji planai, koncepcijos, gatvių kategorijos, raudonosios linijos, leidimai statyti, inžineriniai projektai, specialūs planai, nomenklatūra, gyventojų tankumas",
      id: "teritoriju-planavimas", //theme id class and theme URL query name
      imgUrl: "./app/img/teritorijos.png", //image URL
      imgAlt: "Teritorijų planavimas", // image alt attribute
      layers: {
        teritorijuPlanavimas: { // layer unique name //
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Teritoriju_planavimas/MapServer",
          name: "Teritorijų planavimas ir statyba:",
          isGroupService: true,
          opacity: 0.9
        }
      }
    },
    teritoryReturn: {
      //url: "https://maps.vilnius.lt/maps_vilnius/?theme=teritory-return",
      production: true, //if theme is ready for production
      name: "Žemės grąžinimas", //theme name
      //id: "teritory-return", //theme id class and theme URL query name
      description: "Teritorijų grąžinimo temoje rasite informaciją apie valstybinius žemės plotus, žemės gražinimą /atkūrimą, specialiuosius planus",
      id: "zemes-grazinimas", //theme id class and theme URL query name
      imgUrl: "./app/img/zeme.png", //image URL
      imgAlt: "Teritorijų grąžinimas", // image alt attribute
      layers: {
        teritorijuGrazinimas: { // layer unique name //
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Zemes_grazinimas/MapServer",
          name: "Teritorijų grąžinimas:",
          isGroupService: true
        }
      }
    },
    TeritoryMaintenance: {
      //url: "https://maps.vilnius.lt/maps_vilnius/?theme=teritory-maintenance",
      production: true, //if theme is ready for production
      name: "Miesto tvarkymas", //theme name
      //id: "teritory-maintenance", //theme id class and theme URL query name
      description: "Miesto tvarkymo temoje rasite informaciją apie šių sluoksnių grupes: gatvių priežūra, gatvių ir pėsčiųjų takų tvarkymo darbai, tvarkomos miesto teritorijos, medžių inventorizacija, atliekų tvarkymas",
      id: "miesto-tvarkymas", //theme id class and theme URL query name
      imgUrl: "./app/img/miesto-tvarkymas.png", //image URL
      imgAlt: "Miesto tvarkymas", // image alt attribute
      layers: {
        miestoTvarkymas: { // layer unique name //
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Miesto_tvarkymas/MapServer",
          name: "Miesto tvarkymas:", // dynamicLayers group name
          isGroupService: true
        }
      }
    },
    environment: {
      //url: "https://maps.vilnius.lt/maps_vilnius/?theme=env",
      production: true, //if theme is ready for production
      name: "Aplinkosauga", //theme name
      //id: "env", //theme id class and theme URL query name
      description: "Aplinkosaugos temoje rasite informaciją apie šių sluoksnių grupes: triukšmo sklaida, tyliosios triukšmo ir prevencinės zonos, oro tarša, dugno nuosėdos, paviršinio vandens tarša, uždarytų savartynų tarša",
      id: "aplinkosauga", //theme id class and theme URL query name
      imgUrl: "./app/img/aplinkosauga.png", //image URL
      imgAlt: "Aplinkosauga", // image alt attribute
      layers: {
        aplinkosauga: { // layer unique name //
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Aplinkosauga/MapServer",
          name: "Aplinkosauginiai sluoksniai:", // dynamicLayers group name
          opacity: 0.7,
          isGroupService: true // if layers has grouping in mxd / value for administration purpose only
        }
      }
    },
    cyclingTracks: {
      //url: "https://maps.vilnius.lt/maps_vilnius/?theme=cycling-tracks",
      production: true, //if theme is ready for production
      name: "Transportas / Dviračiai", //theme name
      //id: "cycling-tracks", //theme id class and theme URL query name
      description: "Transporto temoje rasite informaciją apie rinkliavos zonas, kiss and ride stoteles, vaizdo stebėsenos vietas, viešąjį transportą, dviračių trasas, eismo įvykius",
      id: "transportas", //theme id class and theme URL query name
      imgUrl: "./app/img/dviraciai.png", //image URL
      imgAlt: "Transportas / Dviračiai", // image alt attribute
      layers: {
        // accidentsRaster: { // layer unique name //
        //   dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
        //   "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Eismo_ivykiu_tankumas/MapServer",
        //   name: "Eismo įvykių tankumas", // dynamicLayers group name
        //   opacity: 0.7,
        //   isRaster: true //is layer Ratser , do not identify layer if true / default value is false
        // },
        transportas: { // layer unique name //
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Transportas/MapServer",
          name: "Transportas / Dviračiai:",// dynamicLayers group name
          opacity: 0.9
        }
      }
    },
    leisure: {
      //url: "https://maps.vilnius.lt/maps_vilnius/?theme=laisvalaikis",
      production: true, //if theme is ready for production
      name: "Laisvalaikis", //theme name
      description: "Laisvalaikio temoje rasite informaciją apie atviras sales, viešuosius tualetus, jaunimo veiklą, pėsčiųjų trasas",
      id: "laisvalaikis", //theme id class and theme URL query name
      imgUrl: "./app/img/laisvalaikis.png", //image URL
      imgAlt: "Laisvalaikis", // image alt attribute
      layers: {
        laisvalaikis: { // layer unique name //
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Laisvalaikis/MapServer",
          name: "Laisvalaikis" // dynamicLayers group name
        }
      }
    },
    publicCaffes: {
      //url: "https://maps.vilnius.lt/maps_vilnius/?theme=caffee",
      production: true, //if theme is ready for production
      name: "Lauko kavinės", //theme name
      //id: "caffee", //theme id class and theme URL query name
      description: "Lauko kavinių temoje rasite informaciją apie lauko kavines, jų užimamus plotus, leidimus",
      id: "kavines", //theme id class and theme URL query name
      imgUrl: "./app/img/kavines.png", //image URL
      imgAlt: "Lauko kavinės", // image alt attribute
      layers: {
        publicCaf: { // layer unique name //
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/lauko_kavines/MapServer",
          name: "Lauko kavinės" // dynamicLayers group name
        }
      }
    },
    civilSecurity: {
      //url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      production: true, //if theme is ready for production
      name: "Civilinė sauga", //theme name
      //id: "civ-sauga", //theme id class and theme URL query name
      description: "Civilinės saugos temoje rasite informaciją apie gyventojų perspėjimo sirenas, kolektyvinės apsaugos statinius, gyventojų evakuavimo punktus",
      id: "civiline-sauga", //theme id class and theme URL query name
      imgUrl: "./app/img/civiline-sauga.png", //image URL
      imgAlt: "Civilinė sauga", // image alt attribute
      layers: {
        civilFacility: { // layer unique name //
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Civiline_sauga/MapServer",
          opacity: 0.8,
          name: "Civilinė sauga" // dynamicLayers group name
        }
      }
    },
    elderships: {
      //url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      production: true, //if theme is ready for production
      name: "Seniūnijos", //theme name
      //id: "civ-sauga", //theme id class and theme URL query name
      description: "Seniūnijų temoje rasite informaciją apie seniūnijų ribas, būstines, seniūnaitijas, kaimynijas, planuojamus miesto tvarkymo darbų",
      id: "seniunijos", //theme id class and theme URL query name
      imgUrl: "./app/img/seniunijos.png", //image URL
      imgAlt: "Seniūnijos", // image alt attribute
      layers: {
        elderships: { // layer unique name //
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Seniunijos/MapServer",
          opacity: 1,
          name: "Seniūnijos" // dynamicLayers group name
        }
      }
    },
    emptyTeam: {
      //url: "https://maps.vilnius.lt/maps_vilnius/?theme=civ-sauga",
      production: true, //if theme is ready for production
      hide: true, //hide from themes menu, but add route with functionality
      name: "Tuščia tema", //theme name
      //id: "civ-sauga", //theme id class and theme URL query name
      id: "empty", //theme id class and theme URL query name
      imgUrl: "./app/img/civiline-sauga.png", //image URL
      imgAlt: "Tuščia tema" // image alt attribute
    },
    buildings: {
      production: true, //if theme is ready for production
      custom: true, // true if theme funcionality is custom
      name: "Pastatai", //theme name
      description: "Gyvenamųjų pastatų šilumo suvartojimo informacija, faktinio energijos suvartojimo klasės, mėnesiniai šilumos suvartojimai pagal mokėjimus už šilumą", //meta description
      //id: "theme-buildings", //theme id class and theme URL query name
      id: "pastatai", //theme id class and theme URL query name
      imgUrl: "./app/img/pastatai.png", //image URL
      imgAlt: "Pastatai", // image alt attribute
      layers: {
        silumosSuvartojimas: { // layer unique name
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Pastatai_statyba/MapServer",
          name: "Pastatai"
        }
      }
    },
    itvTheme: {
      production: true, //if theme is ready for production
      version: "arcgis4",
      hide: false, //hide from themes menu, but add route with functionality
      custom: true,
      name: "Investiciniai projektai", //theme name
      description: "Interaktyvus investicinių projektų žemėlapis yra skirtas Vilniaus gyventojams ir miesto svečiams patogiai ir išsamiai susipažinti su naujausia informacija apie mieste planuojamus, vykdomus ir jau įgyvendintus investicinius projektus",
      id: "projektai", //theme id class and theme URL query name
      imgUrl: "./app/img/projektai.png", //image URL
      imgAlt: "Investiciniai projektai", // image alt attribute
      info: "Uses static menu legend", //Meta info about project
      layers: {
        //maps layers for scaling on map
        mapLayer: 'https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/itv_projects_GDB/MapServer',
        //all projects (converted to polygon) for listing
        uniqueProjects: 'https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/itv_projects_common_GDB/MapServer',
        //2 base teritories south and north
        teritories: 'https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/itv_teritories/MapServer',
        //identify map service
        identifyLayer: 'https://gis.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/ITV_bendri/MapServer',
        name: 'Investiciniai projektai'
      }
    },
    kindergartens: {
      production: true, //if theme is ready for production
      custom: true, // true if theme funcionality is custom
      name: "Darželiai", //theme name
      //id: "theme-buildings", //theme id class and theme URL query name
      description: "Ikimokyklinių ugdymo įstaigų (darželių, privačių darželių, kitų įstaigų) paieška pagal gyvenamąjį adresą, tipą, kalbą ar grupės amžių",
      id: "darzeliai", //theme id class and theme URL query name
      imgUrl: "./app/img/darzeliai.png", //image URL
      imgAlt: "Darželiai", // image alt attribute
      layers: {
        darzeliai: { // layer unique name
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Darzeliai/MapServer",
          name: "Darželiai"
        }
      }
    },
    buildingsAdministration: {
      url: "https://maps.vilnius.lt/maps_vilnius/?theme=theme-buildings",
      external: true,
      production: true, //if theme is ready for production
      custom: true, // true if theme funcionality is custom
      name: "Pastatų administravimas", //theme name
      //id: "theme-buildings", //theme id class and theme URL query name
      id: "pastatu-administravimas", //theme id class and theme URL query name
      imgUrl: "./app/img/pastatu-administravimas.png", //image URL
      imgAlt: "Pastatų administravimas", // image alt attribute
      layers: {
        administravimas: { // layer unique name
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Pastatu_administravimas/MapServer",
          featureLayerUrls: [
            "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Pastatu_administravimas/MapServer/1"
          ]
        }
      }
    },
    advertise: {
      url: "https://maps.vilnius.lt/maps_vilnius/?theme=ad",
      production: true, //if theme is ready for production
      //legacy: true, // legacy dojo app
      external: true,
      custom: true, // true if theme funcionality is custom
      name: "Reklamos leidimai", //theme name
      id: "leidimai", //theme id class and theme URL query name
      imgUrl: "./app/img/reklamos.png", //image URL
      imgAlt: "Reklamos vietos" // image alt attribute
    },
    tracks: {
      url: "https://vilniuskojoms.lt",
      production: true, //if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Vilnius kojoms", //theme name
      id: "vilnius-kojoms", //theme id class and theme URL query name
      imgUrl: "./app/img/ptakai.png", //image URL
      imgAlt: "Vilnius kojoms" // image alt attribute
    },
    schools: {
      url: "https://maps.vilnius.lt/maps_vilnius/?theme=schools",
      production: true, //if theme is ready for production
      //legacy: true, // legacy dojo app
      external: true,
      custom: true,
      name: "Švietimas", //theme name
      //id: "schools", //theme id class and theme URL query name
      id: "svietimas", //theme id class and theme URL query name
      imgUrl: "./app/img/mokyklos.png", //image URL
      imgAlt: "Švietimas", // image alt attribute
      layers: {
        mokyklos: { // layer unique name //
          dynimacLayerUrls:  //  dynamicService URL, only 1 url per uniquer Layer
            "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Mokyklos/MapServer"
        }
      }
    },
    vilnius3dExternal: {
      url: "https://atviras.vplanas.lt/portal/apps/webappviewer3d/index.html?id=49e0fb95c0ed45d6ae1c5533176f63f3",
      production: true, //if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "3D Vilnius", //theme name
      id: "vilnius-3d", //theme id class and theme URL query name
      imgUrl: "./app/img/vilnius3d.png", //image URL
      imgAlt: "Vilniaus 3D modelis" // image alt attribute
    },
    bpCompareExternal: {
      url: "https://atviras.vplanas.lt/portal/apps/webappviewer3d/index.html?id=49e0fb95c0ed45d6ae1c5533176f63f3",
      production: true, //if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "BP palyginimas", //theme name
      id: "bp-palyginimas", //theme id class and theme URL query name
      imgUrl: "./app/img/bp.png", //image URL
      imgAlt: "Bendrojo plano palyginimas" // image alt attribute
    },
    treesExternal: {
      url: "https://vplanas.maps.arcgis.com/apps/Editor/index.html?appid=f99ff842f8d94967aba4e35baa07fe05",
      production: true, //if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Apsodinkime Vilnių", //theme name
      id: "apsodinkime-vilniu", //theme id class and theme URL query name
      imgUrl: "./app/img/trees.png", //image URL
      imgAlt: "Apsodinkime Vilnių kartu" // image alt attribute
    },
    openDataExternal: {
      url: "http://gis.opendata.lt/",
      production: true, //if theme is ready for production
      external: true, // external application
      custom: true, // true if theme funcionality is custom
      name: "Vilniaus atviri duomenys", //theme name
      id: "open-data", //theme id class and theme URL query name
      imgUrl: "./app/img/od.png", //image URL
      imgAlt: "Vilniaus atviri duomenys" // image alt attribute
    },
    publicOffices: {
      //url: "https://maps.vilnius.lt/maps_vilnius/?theme=public-offices",
      production: false, //if theme is ready for production
      name: "Viešos įstaigos", //theme name
      //id: "public-offices", //theme id class and theme URL query name
      id: "viesosios-istaigos", //theme id class and theme URL query name
      imgUrl: "./app/img/tvarkymas.png", //image URL
      imgAlt: "Viešos įstaigos", // image alt attribute
      layers: {
        viesosIstaigos: { // layer unique name //
          dynimacLayerUrls:  // dynamicService URL, only 1 url per uniquer Layer
            "https://zemelapiai.vplanas.lt/arcgis/rest/services/Interaktyvus_zemelapis/Viesos_istaigos/MapServer",
          opacity: 0.6,
          name: "Viešos įstaigos" // dynamicLayers group name
        }
      }
    },
    legacyMap: {
      production: false, //if theme is ready for production
      custom: true, // true if theme funcionality is custom
      name: "Senoji žemėlapio versija", //theme name
      id: "legacy", //theme id class and theme URL query name
      imgUrl: "/app/img/old_version.png", //image URL
      imgAlt: "Senoji versija", // image alt attribute
      url: "http://www.vilnius.lt/vmap/t1.php" // external url if required, if not - gets internal url depending on id property
    }

  },
  animation: {
    options: {
      animate: true, //default true
      duration: 600,
      easing: "ease-out" // Possible Values: linear | ease | ease-in | ease-out | ease-in-out
    }
  },
  search: {
    // search widget locator url
    locator: "https://gis.vplanas.lt/arcgis/rest/services/Lokatoriai/PAIESKA_COMPOSITE/GeocodeServer",
    addressLocator: "https://gis.vplanas.lt/arcgis/rest/services/Lokatoriai/ADRESAI_V1/GeocodeServer"
  },
  maintenance: {
    msg: 'Puslapis laikinai nepasiekiamas - vykdomi priežiūros darbai. Atsiprašome už nepatogumus'
  },
  notFound: {
    msg: 'Atsiprašome, toks puslapis neegzistuoja'
  }
}

//additionl themes mapOptions
export const HeatingDataValues = {
  color: {
    green: 'rgba(167, 206, 39, 0.8)',
    yellow: 'rgba(249, 212, 31, 0.8)',
    orange: 'rgba(245, 143, 58, 0.8)',
    red: 'rgba(225, 8, 39, .8)',
    purple: 'rgba(148, 39, 105, .8)'
  },
  label: {
    label1: 'Gera (1-3)',
    label2: 'Vidutinė (4-5)',
    label3: 'Bloga (6-8)',
    label4: 'Labai bloga (9-11)',
    label5: 'Ypatingai bloga (12-15)'
  }
}
