// Katie Litchen GEOG 778 Prj
// Updated 17Nov2026
// "###" for placeholder code not in use but i am hoarding it anyways

// original SVI feature layer url: "https://services3.arcgis.com/ZvidGQkLaDJxRSJ2/arcgis/rest/services/CDC_ATSDR_Social_Vulnerability_Index_2022_USA/FeatureServer/2", // edited for TX scope, field updates for customization

//** ESRI Settings:
//  esri.js modules needed: 
 require([
    // for api key:
    "esri/config",
    // for map elements, custom basemap
    "esri/Map", "esri/views/MapView", "esri/Basemap","esri/layers/VectorTileLayer", "esri/widgets/BasemapGallery/support/LocalBasemapsSource",
    // for all widgets used
    "esri/widgets/BasemapGallery", "esri/widgets/Expand","esri/widgets/Locate","esri/widgets/Search","esri/widgets/Legend","esri/widgets/Home","esri/widgets/LayerList",
    // for esri layers
    "esri/layers/FeatureLayer","esri/layers/GroupLayer",
    // other
    "esri/core/reactiveUtils", "esri/renderers/ClassBreaksRenderer",
    ],
    // add all modules to fx - 
    function(esriConfig, Map, MapView, Basemap, vectorTileLayer, LocalBasemapsSource, BasemapGallery, Expand, Locate, Search, Legend, Home, LayerList, FeatureLayer, GroupLayer, reactiveUtils, ClassBreaksRenderer,) {   
    
    // esri api key:
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurBvZ7IXFuSOhRBuDgv645DOBpnCJ2vtGJsSqd0m31lu7G8oTSCniq7WBlH5N3K2i5Kk1zQ90Yxo4NRi0pv9a9tVhNCaTXh4UYBVSuMTZ4n-VHPYlh3hbIHglPgtC4dS9xt9DvdwtH300t76D_qaoPY1hHx-ZWazuU7A71NQteoVL5YMZ3d0qyiM8FhAB_8wsn9Lfxg-Z0qlqMFoRqQ2XStDdlWe0dU69PsLBWTeob7thAT1_t2Pq0hM2"

    ////////////////////

//** Basic Map Elements: 
    // tile layer to hold custom basemap: topo-vector split w/ label sandwich
    const topoBasemap = new Basemap({
    baseLayers: [new vectorTileLayer({portalItem: { id: "4089fb89a3314f67ac69528608c8c614"}})],
    referenceLayers: [new vectorTileLayer({portalItem: { id: "928cf35778b2424db914e501a3bfb5be"}})],
    thumbnailUrl: Basemap.fromId("topo-vector").thumbnailUrl,
    title: "Topographic",
    });

    // map element: 
    const map = new Map({basemap: topoBasemap}); //### replaces topo-vector
        
    // map view + properties:
    const view = new MapView({  
    map: map,
    center: [-95.36, 29.76], // Scaled to HTX
    zoom: 10,                 
    container: "Map", // div element
    constraints: {minScale: 100, maxScale: 600000,}, // limiting max scale (instead of map extent) to keep focus around HTX
    });      
    
    ////////////////////

//** Widgets and Customization:
    // move +/- zoom buttons:
    view.ui.move("zoom", "bottom-right");

    // ### code template for custom basemap label sandwich
    // community, charted territory, navigation, and antique are all single layer vector basemaps
    // ^ would require custom vector tile style editor replacement for each to render labels on top of layers... time intensive, low reward upgrade
    // const topoBasemap = new Basemap({
    // baseLayers: [new vectorTileLayer({portalItem: { id: "4089fb89a3314f67ac69528608c8c614"}})],
    // referenceLayers: [new vectorTileLayer({portalItem: { id: "928cf35778b2424db914e501a3bfb5be"}})],
    // thumbnailUrl: Basemap.fromId("topo-vector").thumbnailUrl,
    // title: "Topographic",
    // });

    
    // basemap ids for custom basemap gallery: 
    const chartedTerritoryBasemap = new Basemap({id: "charted-territory", portalItem: {id: "303e75b27af043fd835c981ab9accf84"}});
    const communityBasemap = new Basemap({id: "community", portalItem: {id: "184f5b81589844699ca1e132d007920e"}});
    const humanGRGBasemap = new Basemap({id: "human-grg", portalItem: {id: "6a6bf92e7824417db632aa1d058a13b4"}});
    const humanGRGDarkBasemap = new Basemap({id: "human-grg-dark", portalItem: {id: "69b9605f8a734c6f861148bb8e5a1f40"}});
    const newspaperBasemap = new Basemap({id: "newspaper", portalItem: {id: "e3c062eedf8b487b8bb5b9b08db1b7a9"}}); // looks kinda meh
    const antiqueBasemap = new Basemap({id: "antique", portalItem: {id: "b69f2876ce4c4e9db185cdc857fcebc7"}});
    const terrainBasemap = new Basemap({id: "terrain", portalItem: {id: "2ef1306b93c9459ca7c7b4f872c070b9"}});

    // basemap gallery widget:
    const basemapGallery = new BasemapGallery({
    view: view,
    source: new LocalBasemapsSource({ // comment out "source" bracket for esri default basemap gallery
        basemaps: [
        topoBasemap,
        terrainBasemap,
        communityBasemap, 
        chartedTerritoryBasemap, 
        humanGRGBasemap, 
        humanGRGDarkBasemap, 
        Basemap.fromId("hybrid"),
        Basemap.fromId("streets-navigation-vector"),
        //Basemap.fromId("streets-vector"), // streets is too orange
        antiqueBasemap, 
        //newspaperBasemap, // style is distracting
        ]
    })
    });

    const basemapExpand = new Expand({ // put basemap gallery widget in an expandable tab 
        view: view,
        content: basemapGallery,
        expandTooltip: "Select Basemap", // text displayed on hover
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
    view.ui.add(reset, "bottom-left") // set reset button location

    // layer-toggle widget:
    const layerList = new LayerList({
        view: view,
        listItemCreatedFunction: (event) => { // Expand all group layers by default
            const { item } = event;
        if (item.layer.type === "group") {item.open = true;}
        }
    });
    const layerExpand = new Expand({ // put layer-toggle widget in an expandable tab 
        view: view,
        content: layerList,
        expandTooltip: "Select Layers", // title display on hover
    });
    view.ui.add(layerExpand, "top-right"); // set layer-toggle button location

    ////////////////////

//** FEMA Flood Hazard Layer:
    // renderer - flood hazard feature layer 1 - color fill:
    const floodRendererColor = {
      type: "unique-value",
      field: "esri_symbology",
      defaultSymbol: null, //{ type: "simple-fill" }, // <- null vs simple fill removes "other" from legend
      uniqueValueInfos: [{
        value: "Regulatory Floodway",
        symbol: {
            type: "simple-fill",
            color: "#034e7b",
            outline: null // remove polygon outline
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
            color: "#034e7b",
            style: "diagonal-cross", // hashing in this renderer for legend display
            outline: null // remove polygon outline
        }
        }]
      };

    // renderer - flood hazard feature layer 2 - hashing + color for levees:
    const floodRendererPattern = {
      type: "unique-value",
      field: "esri_symbology",
      defaultSymbol: null, // other values not rendered 
      uniqueValueInfos: [{
        value: "Area with Reduced Risk Due to Levee",
        symbol: {
            type: "simple-fill",
            color: "#a6bddb", // color only in this layer
            outline: null // remove polygon outline
        }
        }]
      };

    // flood hazard feature layer 1 - color fill:
    const floodLayerColor = new FeatureLayer({
    url: "https://services5.arcgis.com/7weheFjxuNkGGiZi/arcgis/rest/services/USA_Flood_Hazard_Areas_view/FeatureServer",
    renderer: floodRendererColor,
    minScale: 600000, // layer visible at any allowed zoom (inverse of "max scale" from MapView)
    opacity: 0.5, // default basemap labels show through <- ** see if labels can be separated and added back on top
    title: "", // removes sub-header from Legend ("USA Flood Hazard Areas")
    listMode: "hide", // removes child layer from layer toggle widget
    }); 

    // flood hazard feature layer 2 - color + hashing:
    const floodLayerPattern = new FeatureLayer({ // all settings to match flood layer 1
    url: "https://services5.arcgis.com/7weheFjxuNkGGiZi/arcgis/rest/services/USA_Flood_Hazard_Areas_view/FeatureServer",
    renderer: floodRendererPattern,
    minScale: 600000, 
    opacity: 0.5, 
    title: "", 
    listMode: "hide", 
    legendEnabled: false, // removes extra legend item (legend only shows hashing, no color fill)
    }); 
    
    // combine into one flood layer:
    const floodLayer = new GroupLayer({
        title: "FEMA Flood Hazard Areas",
        visibilityMode: "independent", // "independent" for both to show/hide with the parent, "exclusive" for radio-button style
        layers: [floodLayerPattern, floodLayerColor]
    });

    ////////////////////

//** Demographic Feature Layer - Census Tracts, SVI: 
    //**Popups:
    //popup content - entire tract overview:
    const overallTractPopup = {
    "title": "<b>{Tract}</b>", // census tract ID
    "content": "Total Population: <b>{E_TOTPOP}</b> people <br> Tract Size: <b>{AREA_SQMI}</b> square miles <br> Population Density: <b>{Density}</b> people per square mile <br><br> "+ //{COUNTY} <br> list county or nah?
    "<b>Social Vulnerability Index (SVI):</b><br> Composite Percentile Ranking: <b>{Overall_SVI}</b><br><br>" +
    "<b>SVI Component (Theme) Rankings:</b> <br> Socioeconomic Status:<b> {SVI_1}</b><br> Household Characteristics:<b> {SVI_2} </b> <br> Racial & Ethnic Minority Status:<b> {SVI_3} </b><br> Housing Type & Transportation:<b> {SVI_4} </b><br>" +
    "<br> <i>Percentile ranking values range from 0 to 1 with higher values indicating greater vulnerability." +
    "<p><span style='font-size: x-small;'> <br> Data From the Centers for Disease Control and Prevention and Agency for Toxic Substances and Disease Registry 2022 Social Vulnerability Index. Percentile rankings based on national results.</span></p>",
    fieldInfos: [
    {fieldName: "Density", format: {places: 0, digitSeparator: true}}, // places: rounding precision, separator: commas in digits > 1000
    {fieldName: "E_TOTPOP", format: {digitSeparator: true}},
    {fieldName: "AREA_SQMI", format: {places:2}},
    {fieldName: "Overall_SVI", format: {places:2}},
    {fieldName: "SVI_1", format: {places:2}},
    {fieldName: "SVI_2", format: {places:2}},
    {fieldName: "SVI_3", format: {places:2}},
    {fieldName: "SVI_4", format: {places:2}},
    ],
    }; 

    //popup content - overall SVI score:
    const compositeSVIPopup = { // same template as "overall" w/o pop details
    "title": "<b>{Tract}</b>", // census tract ID
    "content": "<b>Social Vulnerability Index (SVI):</b><br> Composite SVI Score: <b>{Overall_SVI}</b><br><br>" +
    "<b>SVI Theme Component Scores:</b> <br> Socioeconomic Status:<b> {SVI_1}</b><br> Household Characteristics:<b> {SVI_2} </b> <br> Racial & Ethnic Minority Status:<b> {SVI_3} </b><br> Housing Type & Transportation:<b> {SVI_4} </b><br>" +
    "<br> <i>Percentile ranking values range from 0 to 1 with higher values indicating greater vulnerability." +
    "<p><span style='font-size: x-small;'><br> Data From the Centers for Disease Control and Prevention and Agency for Toxic Substances and Disease Registry 2022 Social Vulnerability Index. Percentile rankings based on national results.</span></p>",
    fieldInfos: [
    {fieldName: "Overall_SVI", format: {places:2}},
    {fieldName: "SVI_1", format: {places:2}},
    {fieldName: "SVI_2", format: {places:2}},
    {fieldName: "SVI_3", format: {places:2}},
    {fieldName: "SVI_4", format: {places:2}},
    ]
    };

    //popup content - SVI theme 1, socioeconomic:
    const theme1SVIPopup = { // same template as "overall" w/o pop details
    "title": "<b>{Tract}</b>", // census tract ID
    "content": " <b>Theme 1 - Socioeconomic Status: </b><br>SVI Percentile Ranking: <b>{SVI_1}</b><br><br>" +
    "<b>Detailed Demographics:</b> <br><i> Percentage of the population:</i>" +
    "<br> Living \u2265 150% below poverty level:<b> {expression/POV150}%</b> <br> Unemployed (age 16+):<b> {expression/UNEMP}%</b> <br> Spending \u2265 30% of income on housing:<b> {expression/HBURD}%</b> <br> Without high school diploma (age 25+):<b> {expression/NOHSDP}%</b> <br> Without health insurance:<b> {expression/UNINSUR}%</b><br>" +
    "<br> <i>Percentile ranking values range from 0 to 1 with higher values indicating greater vulnerability."+
    "<p><span style='font-size: x-small;'> <br> CDC/ATSDR 2022 SVI and U.S. Census variables from the 5-year American Community Survey (ACS). SVI percentile ranking based on national results.</span></p>",
    expressionInfos: [
    {name: "POV150", expression: "Round(($feature.E_POV150 / $feature.E_TOTPOP) * 100, 1)"},
    {name: "UNEMP", expression: "Round(($feature.E_UNEMP / $feature.E_TOTPOP) * 100, 1)"},
    {name: "HBURD", expression: "Round(($feature.E_HBURD / $feature.E_TOTPOP) * 100, 1)"},
    {name: "NOHSDP", expression: "Round(($feature.E_NOHSDP / $feature.E_TOTPOP) * 100, 1)"},
    {name: "UNINSUR", expression: "Round(($feature.E_UNINSUR / $feature.E_TOTPOP) * 100, 1)"},
    ],
    fieldInfos: [{fieldName: "SVI_1", format: {places:2}},]
    };

    //popup content - SVI theme 2, household characteristics:
    const theme2SVIPopup = { // same template as "overall" w/o pop details
    "title": "<b>{Tract}</b>", // census tract ID
    "content": " <b>Theme 2 - Household Characteristics: </b><br>SVI Percentile Ranking: <b>{SVI_2}</b><br><br>" +
    "<b>Detailed Demographics:</b> <br><i> Percentage of the population:</i>" +
    "<br> Aged 65 & older:<b> {expression/AGE65}%</b> <br> Aged 17 & younger:<b> {expression/AGE17}%</b> <br> With a disability:<b> {expression/DISABL}%</b> <br> Single-parent households:<b> {expression/SNGPNT}%</b> <br> With limited English language proficiency:<b> {expression/LIMENG}%</b><br>" +
    "<br> <i>Percentile ranking values range from 0 to 1 with higher values indicating greater vulnerability."+
    "<p><span style='font-size: x-small;'> <br> CDC/ATSDR 2022 SVI and U.S. Census variables from the 5-year American Community Survey (ACS). SVI percentile ranking based on national results.</span></p>",
    expressionInfos: [
    {name: "AGE65", expression: "Round(($feature.E_AGE65 / $feature.E_TOTPOP) * 100, 1)"},
    {name: "AGE17", expression: "Round(($feature.E_AGE17 / $feature.E_TOTPOP) * 100, 1)"},
    {name: "DISABL", expression: "Round(($feature.E_DISABL / $feature.E_TOTPOP) * 100, 1)"},
    {name: "SNGPNT", expression: "Round(($feature.E_SNGPNT / $feature.E_HH) * 100, 1)"},
    {name: "LIMENG", expression: "Round(($feature.E_LIMENG / $feature.E_TOTPOP) * 100, 1)"},
    ],
    fieldInfos: [{fieldName: "SVI_2", format: {places:2}},]
    };

    //popup content - SVI theme 3, race/ethnicity:
    const theme3SVIPopup = { // same template as "overall" w/o pop details
    "title": "<b>{Tract}</b>", // census tract ID
    "content": " <b>Theme 3 - Racial & Ethnic Minority Status: </b><br>SVI Percentile Ranking: <b>{SVI_3}</b><br><br>" +
    "<b>Detailed Demographics:</b> <br><i> Percentage of the population:</i>" +
    "<br> With racial/ethnic minority status:<b> {expression/MINRTY}%</b> <br>" +
    "<br> Racial and ethnic minority groups include: <i>Hispanic or Latino (of any race), Black and African American, American Indian and Alaska Native, Asian, Native Hawaiian and Other Pacific Islander. <br>"+
    "<br> <i>Percentile ranking values range from 0 to 1 with higher values indicating greater vulnerability."+
    "<p><span style='font-size: x-small;'> <br> CDC/ATSDR 2022 SVI and U.S. Census variables from the 5-year American Community Survey (ACS). SVI percentile ranking based on national results.</span></p>",
    expressionInfos: [{name: "MINRTY", expression: "Round(($feature.E_MINRTY / $feature.E_TOTPOP) * 100, 1)"},],
    fieldInfos: [{fieldName: "SVI_3", format: {places:2}},]
    };

    //popup content - SVI theme 4, housing and transportation:
    const theme4SVIPopup = { // same template as "overall" w/o pop details
    "title": "<b>{Tract}</b>", // census tract ID
    "content": " <b>Theme 4 - Housing Type & Transportation: </b><br>SVI Percentile Ranking: <b>{SVI_4}</b><br><br>" +
    "<b>Detailed Demographics:</b> <br><i> Percentage of the population:</i> <br> Living in in group quarters:<b> {expression/GROUPQ}%</b>"+ 
    "<br><br><i> Percentage of households:</i> <br> In structures with \u2265 10 units:<b> {expression/MUNIT}%</b> <br> In mobile homes:<b> {expression/MOBILE}%</b> <br> With more people than rooms:<b> {expression/CROWD}%</b> <br> With no vehicle available:<b> {expression/NOVEH}%</b><br>" +
    "<br> <i>Percentile ranking values range from 0 to 1 with higher values indicating greater vulnerability."+
    "<p><span style='font-size: x-small;'> <br> CDC/ATSDR 2022 SVI and U.S. Census variables from the 5-year American Community Survey (ACS). SVI percentile ranking based on national results.</span></p>",
    expressionInfos: [
    {name: "GROUPQ", expression: "Round(($feature.E_GROUPQ / $feature.E_TOTPOP) * 100, 1)"},
    {name: "MUNIT", expression: "Round(($feature.E_MUNIT / $feature.E_HH) * 100, 1)"},
    {name: "MOBILE", expression: "Round(($feature.E_MOBILE / $feature.E_HH) * 100, 1)"},
    {name: "CROWD", expression: "Round(($feature.E_CROWD / $feature.E_HH) * 100, 1)"},
    {name: "NOVEH", expression: "Round(($feature.E_LIMENG / $feature.E_HH) * 100, 1)"},
    ],
    fieldInfos: [{fieldName: "SVI_4", format: {places:2}},]
    };

    //popup content - population density:
    const densityPopup = {
    "title": "<b>{Tract}</b>", // census tract ID
    "content": "<b>Population Density:</b><br> <b>{Density}</b> people per square mile <br><br>" +
    "Total Population: <b>{E_TOTPOP}</b> people <br> Tract Size: <b>{AREA_SQMI}</b> square miles <br>"+ 
    "<p><span style='font-size: x-small;'> <br> <i> 2022 U.S. Census variables from the 5-year American Community Survey (ACS).</span></p>",
    fieldInfos: [
    {fieldName: "Density", format: {places: 0, digitSeparator: true}}, // places: rounding precision, separator: commas in digits > 1000
    {fieldName: "E_TOTPOP", format: {digitSeparator: true}},
    {fieldName: "AREA_SQMI", format: {places:2}},
    ],
    };

    //**Renderers:
    // renderer - entire tract overview:
    const overallTractRenderer = {
    type: "simple",
    symbol: {
        type: "simple-fill",
        style: "none", // no polygon fill, just boarders
        outline: {           
            color: "#5e6163",   // transparent grey
            width: 0.7,           // for legend display; map width set in dynamic render,
        }
        }
    };

    // dynamic scaling for tract polygon outlines - entire tract overview:
    overallTractRenderer.visualVariables = [{
          type: "size",
          valueExpression: "$view.scale", // arcade expression
          target: "outline",
          stops: [
            { size: 1.5, value: 500 }, // allegedly arcade expression scales linearly between stops
            { size: 0.5, value: 50000 }, // +2 levels (i think)
            { size: 0.2, value: 300000 }, // +1 level
            { size: 0.0, value: 500000 }, // initial zoom (if layer toggled on, default is off)
          ],},
    ];

    // renderer - overall SVI score
    const compositeSVIRenderer = new ClassBreaksRenderer({
    field: "RPL_THEMES", // <- keep field as the RPL theme for N/A tracts to display correctly
        defaultSymbol: {type: "simple-fill", color: "#948c8c", outline: null,}, // default if null
        defaultLabel: "N/A",
        classBreakInfos: [
        {minValue: 0, maxValue: 0.2500, label: "Low (SVI \u2264 0.25)",
        symbol: { type: "simple-fill", color: "#fee5d9", outline: null, },},
        {minValue: 0.2501, maxValue: 0.5000, label: "Moderate (0.25 < SVI \u2264 0.50)",
        symbol: { type: "simple-fill", color: "#fcae91", outline: null, },},
        {minValue: 0.5001, maxValue: 0.7500, label: "Medium (0.50 < SVI \u2264 0.75)",
        symbol: { type: "simple-fill", color: "#fb6a4a", outline: null,},},
        {minValue: 0.7501, maxValue: 0.9000, label: "High (0.75 < SVI \u2264 0.90)",
        symbol: { type: "simple-fill", color: "#de2d26", outline: null, },},
        {minValue: 0.9001, maxValue: 1.0, label: "Very High (SVI > 0.90)",
        symbol: { type: "simple-fill", color: "#a50f15", outline: null, },}
        ]
    });

    // renderer - SVI theme 1, socioeconomic
    const theme1SVIRenderer = new ClassBreaksRenderer({
    field: "RPL_THEME1", // <- keep field as the RPL theme for N/A tracts to display correctly
        defaultSymbol: {type: "simple-fill", color: "#948c8c", outline: null}, // default if null (-999)
        defaultLabel: "N/A",
        classBreakInfos: [
        {minValue: 0, maxValue: 0.2500, label: "Low (SVI \u2264 0.25)",
        symbol: { type: "simple-fill", color: "#edf8e9", outline: null, },},
        {minValue: 0.2501, maxValue: 0.5000, label: "Moderate (0.25 < SVI \u2264 0.50)",
        symbol: { type: "simple-fill", color: "#bae4b3", outline: null, },},
        {minValue: 0.5001, maxValue: 0.7500, label: "Medium (0.50 < SVI \u2264 0.75)",
        symbol: { type: "simple-fill", color: "#74c476", outline: null,},},
        {minValue: 0.7501, maxValue: 0.9000, label: "High (0.75 < SVI \u2264 0.90)",
        symbol: { type: "simple-fill", color: "#31a354", outline: null, },},
        {minValue: 0.9001, maxValue: 1.0, label: "Very High (SVI > 0.90)",
        symbol: { type: "simple-fill", color: "#006d2c", outline: null, },}
        ]
    });

    // renderer - SVI theme 2, household characteristics
    const theme2SVIRenderer = new ClassBreaksRenderer({
    field: "RPL_THEME2", // <- keep field as the RPL theme for N/A tracts to display correctly
        defaultSymbol: {type: "simple-fill", color: "#948c8c", outline: null}, // default if null (-999)
        defaultLabel: "N/A",
        classBreakInfos: [
        {minValue: 0, maxValue: 0.2500, label: "Low (SVI \u2264 0.25)",
        symbol: { type: "simple-fill", color: "#feedde", outline: null, },},
        {minValue: 0.2501, maxValue: 0.5000, label: "Moderate (0.25 < SVI \u2264 0.50)",
        symbol: { type: "simple-fill", color: "#fdbe85", outline: null, },},
        {minValue: 0.5001, maxValue: 0.7500, label: "Medium (0.50 < SVI \u2264 0.75)",
        symbol: { type: "simple-fill", color: "#fd8d3c", outline: null,},},
        {minValue: 0.7501, maxValue: 0.9000, label: "High (0.75 < SVI \u2264 0.90)",
        symbol: { type: "simple-fill", color: "#e6550d", outline: null, },},
        {minValue: 0.9001, maxValue: 1.0, label: "Very High (SVI > 0.90)",
        symbol: { type: "simple-fill", color: "#a63603", outline: null, },}
        ]
    });

    // renderer - SVI theme 3, race/ethnicity
    const theme3SVIRenderer = new ClassBreaksRenderer({
    field: "RPL_THEME3", // <- keep field as the RPL theme for N/A tracts to display correctly
        defaultSymbol: {type: "simple-fill", color: "#948c8c", outline: null}, // default if null (-999)
        defaultLabel: "N/A",
        classBreakInfos: [
        {minValue: 0, maxValue: 0.2500, label: "Low (SVI \u2264 0.25)",
        symbol: { type: "simple-fill", color: "#f2f0f7", outline: null, },},
        {minValue: 0.2501, maxValue: 0.5000, label: "Moderate (0.25 < SVI \u2264 0.50)",
        symbol: { type: "simple-fill", color: "#cbc9e2", outline: null, },},
        {minValue: 0.5001, maxValue: 0.7500, label: "Medium (0.50 < SVI \u2264 0.75)",
        symbol: { type: "simple-fill", color: "#9e9ac8", outline: null,},},
        {minValue: 0.7501, maxValue: 0.9000, label: "High (0.75 < SVI \u2264 0.90)",
        symbol: { type: "simple-fill", color: "#756bb1", outline: null, },},
        {minValue: 0.9001, maxValue: 1.0, label: "Very High (SVI > 0.90)",
        symbol: { type: "simple-fill", color: "#54278f", outline: null, },}
        ]
    });

    // renderer - SVI theme 4, housing and transportation 
    // const theme4SVIRenderer = new ClassBreaksRenderer({ // (BLUE ON BLUE UGH)
    // field: "RPL_THEME4", // <- keep field as the RPL theme for N/A tracts to display correctly
    //     defaultSymbol: {type: "simple-fill", color: "#948c8c", outline: null}, // default if null (-999)
    //     defaultLabel: "N/A",
    //     classBreakInfos: [
    //     {minValue: 0, maxValue: 0.2500, label: "Low (SVI \u2264 0.25)",
    //     symbol: { type: "simple-fill", color: "#eff3ff", outline: null, },},
    //     {minValue: 0.2501, maxValue: 0.50, label: "Moderate (0.25 < SVI \u2264 0.50)",
    //     symbol: { type: "simple-fill", color: "#bdd7e7", outline: null, },},
    //     {minValue: 0.501, maxValue: 0.75, label: "Medium (0.50 < SVI \u2264 0.75)",
    //     symbol: { type: "simple-fill", color: "#6baed6", outline: null,},},
    //     {minValue: 0.75, maxValue: 0.90, label: "High (0.75 < SVI \u2264 0.90)",
    //     symbol: { type: "simple-fill", color: "#3182bd", outline: null, },},
    //     {minValue: 0.901, maxValue: 1.0, label: "Very High (SVI > 0.90)",
    //     symbol: { type: "simple-fill", color: "#08519c", outline: null, },}
    //     ]
    // });
    
    // const theme4SVIRenderer = new ClassBreaksRenderer({ // (BLUE ON BLUE UGH)
    // field: "RPL_THEME4", // <- keep field as the RPL theme for N/A tracts to display correctly
    //     defaultSymbol: {type: "simple-fill", color: "#948c8c", outline: null}, // default if null (-999)
    //     defaultLabel: "N/A",
    //     classBreakInfos: [
    //     {minValue: 0, maxValue: 0.2500, label: "Low (SVI \u2264 0.25)",
    //     symbol: { type: "simple-fill", color: "rgb(239, 255, 255)", outline: null, },},
    //     {minValue: 0.2501, maxValue: 0.50, label: "Moderate (0.25 < SVI \u2264 0.50)",
    //     symbol: { type: "simple-fill", color: "rgb(189, 250, 231)", outline: null, },},
    //     {minValue: 0.501, maxValue: 0.75, label: "Medium (0.50 < SVI \u2264 0.75)",
    //     symbol: { type: "simple-fill", color: "rgb(107, 223, 214)", outline: null,},},
    //     {minValue: 0.75, maxValue: 0.90, label: "High (0.75 < SVI \u2264 0.90)",
    //     symbol: { type: "simple-fill", color: "rgb(49, 180, 189)", outline: null, },},
    //     {minValue: 0.901, maxValue: 1.0, label: "Very High (SVI > 0.90)",
    //     symbol: { type: "simple-fill", color: "rgb(8, 130, 156)", outline: null, },}
    //     ]
    // });
    const theme4SVIRenderer = new ClassBreaksRenderer({ // grey to avoid blue on blue
    field: "RPL_THEME4", // <- keep field as the RPL theme for N/A tracts to display correctly
        defaultSymbol: {type: "simple-fill", color: "#ddc3c3", outline: null}, // default if null (-999)
        defaultLabel: "N/A",
        classBreakInfos: [
        {minValue: 0, maxValue: 0.2500, label: "Low (SVI \u2264 0.25)",
        symbol: { type: "simple-fill", color: "#f7f7f7", outline: null, },},
        {minValue: 0.2501, maxValue: 0.50, label: "Moderate (0.25 < SVI \u2264 0.50)",
        symbol: { type: "simple-fill", color: "#cccccc", outline: null, },},
        {minValue: 0.501, maxValue: 0.75, label: "Medium (0.50 < SVI \u2264 0.75)",
        symbol: { type: "simple-fill", color: "#969696", outline: null,},},
        {minValue: 0.75, maxValue: 0.90, label: "High (0.75 < SVI \u2264 0.90)",
        symbol: { type: "simple-fill", color: "#636363", outline: null, },},
        {minValue: 0.901, maxValue: 1.0, label: "Very High (SVI > 0.90)",
        symbol: { type: "simple-fill", color: "#252525", outline: null, },}
        ]
    });

    // renderer - population density
    const densityRenderer = new ClassBreaksRenderer({
    field: "Density", // <- keep field as the RPL theme for N/A tracts to display correctly
        defaultSymbol: {type: "simple-fill", color: "#948c8c", outline: null}, // default if null (-999)
        defaultLabel: "N/A",
        classBreakInfos: [
        {minValue: 0, maxValue: 2000, label: "Low (Density \u2264 2,000)",
        symbol: { type: "simple-fill", color: "#fcc5c0", outline: null, },},
        {minValue: 2000.001, maxValue: 4000, label: "Moderate (2,000 < Density \u2264 4,000)",
        symbol: { type: "simple-fill", color: "#fa9fb5", outline: null, },},
        {minValue: 4000.001, maxValue: 6000, label: "Medium (4,000 < Density \u2264 6,000)",
        symbol: { type: "simple-fill", color: "#f768a1", outline: null,},},
        {minValue: 6000.001, maxValue: 8000, label: "High (6,000 < Density \u2264 8,000)",
        symbol: { type: "simple-fill", color: "#c51b8a", outline: null, },},
        {minValue: 8000.001, maxValue: 64000, label: "Very High (Density > 8,000)",
        symbol: { type: "simple-fill", color: "#7a0177", outline: null, },}
        ]
    });

    //** Feature Layers:
    // census tracts feature layer - tract overview, empty polygons:
    const overallTract = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/SVI2022_US_tract__TX/FeatureServer", // created new hosted layer for edits
    renderer: overallTractRenderer,
    popupTemplate: overallTractPopup,
    //minScale: 300000 // appear after 1x zoom level ### <- n/a handled in dynamic render
    title: "Tract Boundaries & Overview",
    //visible: false, // ### to make layer de-selected on-load
    });

    // census tracts feature layer - overall SVI choropleth:
    const compositeSVI = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/SVI2022_US_tract__TX/FeatureServer", // created new hosted layer for edits
    renderer: compositeSVIRenderer,
    popupTemplate: compositeSVIPopup,
    opacity: 0.3,
    title: "Composite SVI Score",
    visible: true, // layer is de-selected on-load
    });

    // census tracts feature layer - theme 1 choropleth, socioeconomic:
    const theme1SVI = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/SVI2022_US_tract__TX/FeatureServer", // created new hosted layer for edits
    renderer: theme1SVIRenderer,
    popupTemplate: theme1SVIPopup, 
    opacity: 0.3,
    title: "SVI Theme 1 - Socioeconomic Status",
    visible: false, // layer is de-selected on-load
    });

    // census tracts feature layer - theme 2 choropleth, household characteristics:
    const theme2SVI = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/SVI2022_US_tract__TX/FeatureServer", // created new hosted layer for edits
    renderer: theme2SVIRenderer,
    popupTemplate: theme2SVIPopup,
    opacity: 0.3,
    title: "SVI Theme 2 - Household Characteristics",
    visible: false, // layer is de-selected on-load
    });

    // census tracts feature layer - theme 3 choropleth, race/ethnicity:
    const theme3SVI = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/SVI2022_US_tract__TX/FeatureServer", // created new hosted layer for edits
    renderer: theme3SVIRenderer,
    popupTemplate: theme3SVIPopup,
    opacity: 0.3,
    title: "SVI Theme 3 - Racial & Ethnic Minority Status",
    visible: false, // layer is de-selected on-load
    });

    // census tracts feature layer - theme 4 choropleth, housing and transportation:
    const theme4SVI = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/SVI2022_US_tract__TX/FeatureServer", // created new hosted layer for edits
    renderer: theme4SVIRenderer,
    popupTemplate: theme4SVIPopup,
    opacity: 0.3,
    title: "SVI Theme 4 - Housing Type & Transportation",
    visible: false, // layer is de-selected on-load
    });

    // census tracts feature layer - population density:
    const density = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/SVI2022_US_tract__TX/FeatureServer", // created new hosted layer for edits
    renderer: densityRenderer,
    popupTemplate: densityPopup,
    opacity: 0.3,
    title: "Population Density",
    visible: false, // layer is de-selected on-load
    });

    // combine choropleths into one demographic layer:
    const demoLayer = new GroupLayer({
        title: "Demographic Categories",
        visibilityMode: "exclusive", // "exclusive" for radio-button style
        layers: [density, theme4SVI, theme3SVI, theme2SVI, theme1SVI, compositeSVI],
        visible: false, // layer is de-selected on-load
    });

    // combine demo layer + tract outlines into one census tract layer:
    const tractLayer = new GroupLayer({
        title: "Census Tract Demographics",
        visibilityMode: "independent", // "independent" all layers on/off w/ group-layer parent
        layers: [demoLayer, overallTract]
    });

//** Add Feature Layers to map:
    //map.addMany([floodLayer_2, floodLayer]); // Layer 2 1st for legend order // ## combo layer instead
    //map.add(demoTract_SVI); // currently rendering below the flood layer
    map.add(tractLayer)
    map.add(floodLayer); // ** one add many at the end, individual adds for testing/dev
    //map.add(demoTract);
      
    ////////////////////

//** Legend Elements:
    // legend constructor:
    const myLegend = new Legend ({
      view: view,
      //layerInfos: [{layer: floodLayer},{layer: floodLayer_2, title: ""}], // ## combo layer instead
      layerInfos: [{layer: floodLayer},{layer: tractLayer},],
    });
    // put legend in expandable widget:
    const legendExpand = new Expand ({
      view: view,
      content: myLegend,
      expandTooltip: "Legend",
    });
    view.ui.add(legendExpand, "top-left"); // set legend location

    ////////////////////

//** Watch, Reactive fx:

    // tract overview pop-up disappears when demographic layer selected (couldn't get it to de-prioritize instead)
    reactiveUtils.watch(
    () => demoLayer.visible,
    (isVisible) => {overallTract.popupEnabled = !isVisible;},
    { initial: true } // state is set right as map loads
    );

    // update open pop-up template when layer selection changes (bug-ish but it seems to close popup when it fails which would be next intent anyways)
    view.when(() => {
    reactiveUtils.watch( 
    () => view.map.allLayers.map((layer) => layer.visible), // watch layer visibility in map view
    () => {if (view.popup.visible ) {view.popup.open({fetchFeatures: true});}} // if a popup is open, re-query visible layer & load PopupTemplate
    );
    });




    //map.basemap.load().then(() => {
//   // Verify how the layers are split
//   console.log("Bottom layers:", map.basemap.baseLayers.toArray());
//   console.log("Top reference layers:", map.basemap.referenceLayers.toArray());

  // Example: Swap out the bottom base layer while keeping the top labels
  //const customBase = new TileLayer({ url: "https://your-custom-base-tile-url" });
  //map.basemap.baseLayers.removeAll();
  //map.basemap.baseLayers.add(customBase);
//});

    //////////////////// the end ////////////////////
});