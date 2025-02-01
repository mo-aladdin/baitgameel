import {Base, BoolJsonStr, NumberJsonStr, fetchJson, toValidId, htmlToElement} from "./common";
import {
    Tabulator,
    ResponsiveLayoutModule,
    SelectRowModule,
    FormatModule,
    InteractionModule,
    FilterModule,
    PageModule,
    SortModule,
    EditModule,
    Formatter,
    CellComponent,
    EmptyCallback,
    ColumnDefinition,
    FormatterParams,
    RowComponent,
    GroupRowsModule,
    RowRangeLookup
} from "tabulator-tables";
import BiggerPicture, { BiggerPictureInstance } from "bigger-picture";

/**
 * Models and Interfaces
 */

interface IUnitBase {
    _RowNumber: string;
    id: string;
    area: string;
    status: "INSPECTED" | "CANCEL" | "Agreement";
    type: "APT شقة" | "CHALLETTE شالية" | "VILLA فيلا" | "Hotel" | "";
    img_uri2: string | "";
    img_uri3: string | "";
    img_uri4: string | "";
    img_uri5: string | "";
    img_uri1: string | "";
    img_uri6: string | "";
    img_uri7: string | "";
    img_uri8: string | "";
    img_uri9: string | "";
    img_uri10: string | "";
}

interface IUnitJson extends IUnitBase {
    rooms: NumberJsonStr;
    bathrooms: NumberJsonStr;
    floor: NumberJsonStr;
    internet: BoolJsonStr;
    elevator: BoolJsonStr;
    website_show: BoolJsonStr;
}

interface Unit extends IUnitBase {
    rooms: number;
    bathrooms: number;
    floor: number;
    internet: boolean;
    elevator: boolean;
    website_show: boolean;
    images: string[];
    }

const i18nEn = {
    "image": "Image",
    "unitImagePlaceholder": "This is a real-life image from the unit. Please wait while loading the image.",
    "errorLoadingData": "An error has occured and apartment data couldn't be loaded. Please try reloading the page.",
    "Rooms": "Rooms",
    "Bathrooms": "Bathrooms",
    "Internet": "Internet",
    "Elevator": "Elevator Available",
    "Floor": "Floor",
    "groundFloor": "Ground Floor",
    "Type": "Unit Type",
    "Region": "Region",
    "Rating": "Rating",
}

const i18nAr = {
    "image": "صورة",
    "unitImagePlaceholder": "هذه صورة على الطبيعة من الوحدة. يرجى الانتظار أثناء تحميل الصورة.",
    "errorLoadingData": "تعذر تحميل بيانات الوحدات. من فضلك حاول إعادة تحميل الصفحة.",
    "Rooms": "عدد الغرف",
    "Bathrooms": "عدد الحمامات",
    "Internet": "يوجد إنترنت",
    "Elevator": "يوجد مصعد",
    "Floor": "الطابق",
    "groundFloor": "الطابق الأرضي",
    "Type": "نوع الوحدة",
    "Region": "المنطقة",
    "Rating": "التقييم",
};


const i18n = /^\/ar\//.test(window.location.pathname) ? i18nAr : i18nEn;

class Unit extends Base implements Unit {
  constructor(unit : IUnitJson) {
    super();
    Object.assign(this, unit);
    this.rooms = this.normaliseJsonNumber(unit.rooms, true);
    this.bathrooms = this.normaliseJsonNumber(unit.bathrooms, true);
    this.floor = this.normaliseJsonNumber(unit.floor, false);
    this.internet = this.normaliseJsonBool(unit.internet);
    this.elevator = this.normaliseJsonBool(unit.elevator);
    this.website_show = this.normaliseJsonBool(unit.website_show);
    // group image links under images key
    this.images = [];
    for (let i = 1; i <= 10; i++) {
      const key = `img_uri${i}`;
      if (this[key]) {
        this.images.push(this[key]);
      }
    }
  }
}

/**
 * View
 */

// BiggerPicture image gallery
const bp = BiggerPicture({target: document.body});
function openGallery(imageLinks: HTMLAnchorElement[], e: Event) {
    e.preventDefault();
    bp.open({items: imageLinks, el: e.currentTarget, position: 0});
}

export class UnitTable {
  container: HTMLDivElement;

  constructor(selector : string) {
    // Fetch unit data and construct Tabulator
    this.container = document.querySelector(selector);
    const url = "https://www.appsheet.com/api/v2/apps/552c98ce-713d-49f7-be78-97dba061e775/tables/units/Action";
    const headers = {
      ApplicationAccessKey: "V2-eHcHF-U8nNx-R5pAk-dSh6n-Hf3ME-5KyL3-YHHrc-7AYEQ"
    };
    const body = {
      Action: "Find"
    };
    const rowHeight = "300px";
    fetchJson<IUnitJson[]>(url, headers, body, false, "POST").then((data) => {
      const units: Unit[] = data.map((unit) => new Unit(unit));
      Tabulator.registerModule([
        ResponsiveLayoutModule,
        SelectRowModule,
        FilterModule,
        EditModule,
        SortModule,
        PageModule,
        FormatModule,
        InteractionModule,
        GroupRowsModule
      ]);
      const unitTable = new Tabulator(selector, {
        data: units,
        columnDefaults: {
          hozAlign: "center",
          headerHozAlign: "center"
        },
        index: "id",
        groupBy: "area",
        // @ts-ignore
        rowHeight: rowHeight,
        layout: "fitColumns",
        selectableRows: "highlight",
        rowFormatter:function(row){
            const element = row.getElement(),
            data: Unit = row.getData() as Unit;

            //define a table layout structure and set width of row
            const rowContainer = document.createElement("div");
            rowContainer.classList.add("row");

            // add unit images on left of row
            const imageGalleryEle = renderUnitImages(data, rowHeight);
            rowContainer.appendChild(imageGalleryEle);

            // add unit data on right of row
            const dataHtml = `
                <div class="col-md-3 col-sm-12">
                    <h4>${data.type}</h4>
                      <dl>
                        <dt><i class="fa-solid fa-map-location-dot"></i> ${i18n.Region}</dt>
                        <dd>${data.area}</dd>
                        <div class="d-flex justify-content-between">
                          <div><i class="fa-solid fa-archway"></i> <spn class="fw-bold">${i18n.Rooms}</spn></div>
                          <span class="badge text-bg-dark">${data.rooms}</span>
                        </div>
                        <div class="d-flex justify-content-between my-2">
                          <div><i class="fa-solid fa-bath"></i> <spn class="fw-bold">${i18n.Bathrooms}</spn></div>
                          <span class="badge text-bg-dark">${data.bathrooms}</span>
                        </div>
                        <div class="d-flex justify-content-between my-2">
                          <div>
                            <i class="fa-solid fa-stairs"></i>
                            <spn class="fw-bold"> ${i18n.Floor}</spn>
                            ${data.floor == 0 ? i18n.groundFloor : data.floor}
                          </div>
                          <div>
                            <span>
                                ${data.elevator ? `<span><i class="fa-solid fa-elevator text-success"></i> ${i18n.Elevator}</span>` : ''}
                            </span>
                          </div>
                        </div>
                        <div class="d-flex justify-content-between my-2">
                          <div>
                            ${ data.internet ? `<span class="text-success"><i class="fa-solid fa-wifi"></i></span> ${i18n.Internet}` : '' }
                          </div>
                        </div>
                      </dl>

                </div>`;
            const dataEle = htmlToElement(dataHtml);
            rowContainer.appendChild(dataEle);
            //clear current row data
            while(element.firstChild) { element.removeChild(element.firstChild) };
            //append newly formatted contents to the row
            element.append(rowContainer);
            return element
        },
        // groupHeader: (value : string, count : number, data : Unit) => {
        //   let title: string,
        //     description: string;
        //   switch (value) {
        //        description has class="small" to counter tabulator CSS font
        //     case "new":
        //       title = "New Findings";
        //       description = `<p class="small">The following ${count} findings are brand new. Selecting a finding here will import it to the report but not the IFinding Database.<p/>`;
        //       break;
        //   }
        //   const html = `<h4>${title} <span class="badge badge-light">${count}</span></h4>${description}`;
        //   return html;
        // },
        columns: [
          {
            title: i18n.Type,
            field: "type",
            sorter: "string",
            headerFilter: "list",
            headerFilterParams: {
                // @ts-ignore
                valuesLookup: true
            }
        }, {
            title: i18n.Region,
            field: "area",
            sorter: "string",
            headerFilter: "list",
            headerFilterParams: {
                // @ts-ignore
                valuesLookup: true
            }
          }, {
            title: i18n.Rooms,
            field: "rooms",
            sorter: "number",
            headerFilter: "number"
          }, {
            title: i18n.Bathrooms,
            field: "bathrooms",
            sorter: "number",
            headerFilter: "number"
          }, {
            title: i18n.Rating,
            field: "rating",
            formatter: "star",
            hozAlign: "center"
          }, {
            title: i18n.Floor,
            field: "floor",
            sorter: "number",
            headerFilter: "number"
          }, {
            title: i18n.Elevator,
            field: "elevator",
            sorter: "boolean",
            headerFilter: "tickCross"
          }, {
            title: i18n.Internet,
            field: "internet",
            sorter: "boolean",
            headerFilter: "tickCross"
          },
        ],
      });
      // clear filter event
      const clearFilter = document.getElementById("filter-clear");
      clearFilter.addEventListener("click", () => {unitTable.clearFilter(true)})
    }).catch((error) => {
      this.container.innerHTML = `
      <div class="alert alert-danger d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
        <div>
          ${i18n.errorLoadingData}
        </div>
      </div>`;
    });
  }
}

function renderUnitImages(unit: Unit, height: string): HTMLElement {
    // create carousel container element
    const unitId: string = unit.id
    const carouselId = `carousel-${toValidId(unitId)}`;
    const containerHtml = `<div id="${carouselId}" class="carousel slide col-md-8 col-sm-12" data-bs-ride="carousel">
      <div class="carousel-indicators">
      </div>
      <div class="carousel-inner">
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>`;
    const container = htmlToElement(containerHtml);
    // create image elements and append them to container
    const imageSrcs: string[] = unit.images;
    const links: HTMLAnchorElement[] = []
    const imgAlt = i18n.unitImagePlaceholder
    for (let i = 0; i < imageSrcs.length; i++) {
        // Carousel element
        const src = imageSrcs[i]
        const carouselEleHtml = `<div class="carousel-item ${i == 0 ? 'active' : ''}">
                            <a href="${src}" data-img="${src}" data-thumb="${src}" data-alt="${imgAlt}">
                              <img src="${src}" style="height: ${height}; width: 100%; object-fit: contain;" class="lazyloaded" loading="lazy" alt="${imgAlt}" />
                            </a>
                          </div>`;
        const carouselEle = htmlToElement(carouselEleHtml);
        container.getElementsByClassName("carousel-inner")[0].appendChild(carouselEle);
        // Button indicator
        const indicatorHtml = `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" class="${ i==0 ? 'active' : ''}" aria-current="true" aria-label="${i}"></button>`
        const indicatorEle = htmlToElement(indicatorHtml)
        container.getElementsByClassName("carousel-indicators")[0].appendChild(indicatorEle);
        // bigger picture
        const link = carouselEle.getElementsByTagName("a")[0]
        links.push(link)
    }
    links.forEach(link => link.addEventListener("click", openGallery.bind(null, links)));
    return container;
}