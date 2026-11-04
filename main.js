// Katie Litchen GEOG 778 Prj
// Updated 27Oct2026
// "###" for placeholder code not in use but i am hoarding it anyways  

 

//** ESRI Settings:
//  esri.js modules needed: ### remove dead-code for unused modules at end of prj
 require([
    // for api key:
    "esri/config",
    // for map elements, custom basemap
    "esri/Map", "esri/views/MapView", "esri/Basemap","esri/layers/VectorTileLayer",
    // for all widgets used
    "esri/widgets/BasemapGallery","esri/widgets/Expand","esri/widgets/Locate","esri/widgets/Search","esri/widgets/Editor","esri/widgets/Legend","esri/widgets/Home","esri/widgets/LayerList",
    // for esri layers
    "esri/layers/FeatureLayer",
    "esri/layers/GroupLayer",
    // all modules added to fx - 
], function(esriConfig, Map, MapView, Basemap, vectorTileLayer, BasemapGallery, Expand, Locate, Search, Editor, Legend, Home, LayerList, FeatureLayer, GroupLayer) {   
        
    // esri api key:
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurBvZ7IXFuSOhRBuDgv645DOBpnCJ2vtGJsSqd0m31lu7G8oTSCniq7WBlH5N3K2i5Kk1zQ90Yxo4NRi0pv9a9tVhNCaTXh4UYBVSuMTZ4n-VHPYlh3hbIHglPgtC4dS9xt9DvdwtH300t76D_qaoPY1hHx-ZWazuU7A71NQteoVL5YMZ3d0qyiM8FhAB_8wsn9Lfxg-Z0qlqMFoRqQ2XStDdlWe0dU69PsLBWTeob7thAT1_t2Pq0hM2"
        
//** Basic Map Elements: 
    // tile layer to hold custom basemap: // ### Topo looks cleaner
    const basemapLayer = new vectorTileLayer({
    portalItem: { 
        id: "659e7c1b1e374f6c8a89eefe17b23380" // "outdoor" tile layer from the living atlas
        }
    });

    // map element: 
    const map = new Map({
    basemap: "topo-vector"
    // basemap: new Basemap({
    //     baseLayers: [basemapLayer], // set to custom layer <- ###
    //     })
    });
        
    // map view + properties:
    const view = new MapView({  
    map: map,
    center: [-95.36, 29.76], // Scaled to HTX
    zoom: 10,                 
    container: "Map", // div element
    constraints: {
        minScale: 100,
        maxScale: 600000, // limiting max scale (instead of map extent) to keep focus around HTX
    },
    });                         
    
//** Widgets and Customization:
    // move +/- zoom buttons:
    view.ui.move("zoom", "bottom-right");
    
    // basemap gallery widget:
    const basemapGallery = new BasemapGallery({
    view: view,
    });
    const basemapExpand = new Expand({ // put basemap gallery widget in an expandable tab 
        view: view,
        content: basemapGallery 
    });
    view.ui.add(basemapExpand, "top-right"); //set expandable tab location

    // search widget:
    const search = new Search({
    view: view
    });
    view.ui.add(search, "bottom-left"); // set search bar location

    // locate widget: 
    const locate = new Locate({
    view: view
    });
    view.ui.add(locate, "bottom-left"); // set locate button location

    // reset default view widget:
    const reset = new Home({
        view: view
    })
    view.ui.add(reset, "bottom-left") // set locate button location

    // layer-toggle widget:
    const layerList = new LayerList({
        view: view // Reference to your MapView or SceneView
    });
    const layerExpand = new Expand({ // put layer-toggle widget in an expandable tab 
        view: view,
        content: layerList
    });
    view.ui.add(layerExpand, "top-right"); // set layer-toggle button location

//** FEMA Flood Hazard Layer:
    // renderer for flood zone polygons - fill color:
    const floodRenderer = {
      type: "unique-value",
      field: "esri_symbology",
      defaultSymbol: null, //{ type: "simple-fill" }, // <- null removes "other" from legend
      uniqueValueInfos: [{
        value: "Regulatory Floodway",
        symbol: {
            type: "simple-fill",
            color: "#034e7b",
        }
        },{
        value: "1% Annual Chance Flood Hazard",
        symbol: {
            type: "simple-fill",
            color: "#3690c0",
            outline: null // remove polygon outline
        }
        },{
        value: "0.2% Annual Chance Flood Hazard",
        symbol: {
            type: "simple-fill",
            color: "#74a9cf",
            outline: null // remove polygon outline
        }
        },{
        value: "Area with Reduced Risk Due to Levee",
        symbol: {
            type: "simple-fill",
            color: "#a6bddb",
            outline: null // remove polygon outline
        }
        }]
      };

    // renderer for 2nd layer of flood zone polygons - hashing for levee zones:
    const floodRenderer_2 = {
      type: "unique-value",
      field: "esri_symbology",
      defaultSymbol: null, // other values not rendered 
      uniqueValueInfos: [{
        value: "Area with Reduced Risk Due to Levee",
        symbol: {
            type: "simple-fill",
            color: "#034e7b",
            style: "diagonal-cross",
            outline: null // remove polygon outline
        }
        }]
      };

    // flood hazard feature layer 1 - solid fill:
    const floodLayer = new FeatureLayer({
    url: "https://services5.arcgis.com/7weheFjxuNkGGiZi/arcgis/rest/services/USA_Flood_Hazard_Areas_view/FeatureServer",
    //popupTemplate: popup_wiParks, ### placeholder for pop-ups, not desired 
    //labelingInfo: [parkName], // ### placeholder for labels, not desired
    renderer: floodRenderer,
    minScale: 600000, // layer visible at any allowed zoom (inverse of "max scale" from MapView)
    opacity: 0.5, // default basemap labels show through <- ** see if labels can be separated and added back on top
    title: "", // removes sub-header from Legend ("USA Flood Hazard Areas")
    }); 

    // flood hazard feature layer 2 - hashing:
    const floodLayer_2 = new FeatureLayer({
    url: "https://services5.arcgis.com/7weheFjxuNkGGiZi/arcgis/rest/services/USA_Flood_Hazard_Areas_view/FeatureServer",
    renderer: floodRenderer_2,
    minScale: 600000, // all settings to match flood layer 1
    opacity: 0.5, 
    title: "", 
    }); 
    
    // combine back into one flood layer:
    const floodLayerCombo = new GroupLayer({
        title: "Flood Hazard Areas",
        visibilityMode: "independent", // "independent" for both to show/hide with the parent, "exclusive" for radio-button style
        layers: [floodLayer_2, floodLayer] // ^ ** see if each individual layer can be fully removed from the toggle
    });

//** Demographic Feature Layer - Census Tracts SVI: 

    //popup content:
    const popup_censusDemo = {
    "title": "<b>{Location}</b><br>", // ** see if theres a better value to use as a header
    "content": "<b>Overall SVI Score:</b> {RPL_THEMES} <br> <b>Theme 1:</b> {RPL_THEME1} (Socioeconomic) <br><b>Theme 2:</b> {RPL_THEME2} (Household Characteristics) <br> <b>Theme 3:</b> {RPL_THEME3} (Racial and Ethnic Minority Status) <br> <b>Theme 4:</b> {RPL_THEME4} (Housing Type/Transportation)<br>"
    }; // ^ pop-up content just for initial filler


    // renderer for census demo layer: 
    const initialDemoRenderer = {
    type: "simple",
    symbol: {
        type: "simple-fill",
        style: "none", // no polygon fill, just boarders
        outline: {           
            color: "#5e6163",   // transparent grey
            width: 0.7,           // for legend display; map width set in dynamic render,
        }
        }
    }

    // dynamically scale polygon outlines:
    initialDemoRenderer.visualVariables = [
        {
          type: "size",
          valueExpression: "$view.scale", // arcade expression
          target: "outline",
          stops: [
            { size: 1.5, value: 500 }, // allegedly arcade expression scales linearly between stops
            { size: 0.5, value: 50000 }, // +2 levels (i think)
            { size: 0.2, value: 300000 }, // +1 level
            { size: 0, value: 500000 }, // initial zoom
          ],
        },
      ];

    // census tracts feature layer:
    const demoTract = new FeatureLayer({
    url: "https://services3.arcgis.com/ZvidGQkLaDJxRSJ2/arcgis/rest/services/CDC_ATSDR_Social_Vulnerability_Index_2022_USA/FeatureServer/2",
    renderer: initialDemoRenderer,
    popupTemplate: popup_censusDemo,
    //minScale: 300000 // appear after 1x zoom level ### <- n/a handled in dynamic render
    title: "US Census Tracts",
    })


//** Add Feature Layers to map:
    //map.addMany([floodLayer_2, floodLayer]); // Layer 2 1st for legend order // ## combo layer instead
    map.add(floodLayerCombo); // ** one add many at the end, individual adds for testing/dev
    map.add(demoTract);  

//** Legend Elements:
    // legend constructor:
    const myLegend = new Legend ({
      view: view,
      //layerInfos: [{layer: floodLayer},{layer: floodLayer_2, title: ""}], // ## combo layer instead
      layerInfos: [{layer: floodLayerCombo},{layer: demoTract},],
    });
    // put legend in expandable widget:
    const legendExpand = new Expand ({
      view: view,
      content: myLegend
    })
    view.ui.add(legendExpand, "top-right"); // put legend in expandable tab

});