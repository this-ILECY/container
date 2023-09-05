import { UntypedFormGroup } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AxisEnum, ContainerDisplayMode, HandleDisplayEnum, HandleXEnum, HandleYEnum } from " . /models/container. enum";
import { ElementConfig, IGridConfig } from './models/grid-config-interface';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, AfterViewInit {
  title = 'grid';

  public basics: any;



  private subscription: Subscription = new Subscription;





















































  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @ViewChild('allMother', { static: true }) AllMother: ElementRef;
  @ViewChild('controller', { static: true }) Controller: ElementRef;
  @Input() gridConfig: IGridConfig;

  ngAfterViewInit(): void {

    // this.configValidator()
    this.pageGenerator();
    this.basics = this.GetListOfCount();
    if ((this.gridConfig.DisplayMode === ContainerDisplayMode.normal)) {
      this.moveController();
    }

  }

  /*
  * get list of elements to send to metadata
  * for controller box
  */










  /*
* if this isn't an auto-generated template,
* and count of html element and their configs do not match,
* throws error
* (parent configs won't be included (IsParent = true))
*/
  configValidator() {
    let childCount = Array.from(((this.AllMother.nativeElement) as Element).children).filter(x => !x.classList.contains("controller")).length;
    if (this.gridConfig.ElementConfig.length != 0 && childCount !== this.gridConfig.ElementConfig.filter(x => !x.IsParent).length && (!this.gridConfig.AutoTemplate))
      throw new Error("Uncaught (in promise): TypeError: count of configs did not match your page. \nat cy-Container. InPlease make sure you have added correct configuration");
  }

  private rowCountController = 0;
  /*
* generating handlers, setting the configs and adding classes
  */
  pageGenerator() {


    let allMother = (this.AllMother.nativeElement) as Element
    this.rowCountController = getComputedStyle(allMother).gridTemplateRows.split(" ").length;

    if (!this.gridConfig) return;

    (allMother as HTMLElement).style.gridTemplateColumns = 'repeat(' + this.gridConfig.Resolution + ', 1fr)';
    (allMother as HTMLElement).style.gridTemplateRows = 'repeat(' + this.gridConfig.ResolutionY + ', 1fr)'

    if (this.gridConfig.ElementConfig.length = 0) return;

    let generatedList = this.listGenerator(this.gridConfig.ElementConfig);

    let index = 0;

    (Array.from(allMother.children).filter(x => !x.classList.contains("controller"))).forEach(element => {

      (element as HTMLElement).style.gridArea = generatedList[index];

      if (this.gridConfig.ElementConfig.length = 0) return


      //adding handles
      // if (!this.gridConfig. ElementConfig. some(x => x. IsParent)) {

      //if we have config for handle, add it; else, add default locations 
      let handleLocation = [this.gridConfig.ElementConfig[index].HandleLocationX ? this.gridConfig.ELementConfig[index].HandleLocationX : HandleXEnum.right,
      this.gridConfig.ElementConfig[index].HandleLocationY ? this.gridConfig.ElementConfig[index].HandleLocationY : HandleYEnum.bottom]

      this.handleGenerator(element, handleLocation, this.gridConfig.ElementConfig[index].Resizable)
      // }

      // let fillHeight: boolean = this.gridConfig.ElementConfig [index].FillHeight;
      // let fillwidth: boolean = this.gridConfig.ElementConfig [index].Fillwidth;
      let hidden: boolean = this.gridConfig.ElementConfig[index].Hidden;











      if (hidden == true) {
        element.remove()
      }

      element.classList.add("basic", "basic-" + (index + 1))

      if (this.gridConfig.ElementConfig[index].GroupId) {

        element.classList.add("container-child-" + this.gridConfig.ElementConfig[index].GroupId)
      }

      index++

    })

    /*
    * setting with parent config is optional.
    * if user sent the config with a parent (isParent = true),
    * the "groupRealigner" re-aligns the structure.
    */
    if (this.gridConfig.ElementConfig.filter(x => x.IsParent).length > 0) {

      // (this .Controller.nativeElement as HTMLELement).classList.add("d-container-none")
      let rwoGroupIndexes = this.getGroups().filter(this.onlyUnique)

      this.groupRealigner(rwoGroupIndexes)
    }
  }

  /*
  * removes the grouped children and adds them inside their parent.
  * parent row(start / end) and col(start / end) are based on his child's configs
  * indexes is available Ids that user used in ElementConfig as GroupId or GroupId
  */
  groupRealigner(indexes: number[]) {
    let allMother = (this.AllMother.nativeElement) as Element;

    indexes.forEach(index => {

      //this number is a trick; every first 'gridowStart' and 'gridColumnStart has to be assign to variable in 'gettingGrids' (goto) below.
      //in 'gettingGrids', we check for smallest 'gridowStart" and gridColumnStart; of course they are smaller than 9999
      let rowStart: number = 9999;
      let colStart: number = 9999;

      //this number is a trick; every last 'gridRowEnd and 'gridColumnEnd' has to be assign to variable in 'gettingGrids* (goto) below
      //in 'gettingGrids' we check for smallest 'gridRowEnd" and 'gridColumnEnd'; of course they are bigger than 0 
      let rowEnd: number = 0
      let colEnd: number = 0

      let parentConfig: ElementConfig;

      let indexedChildren = allMother.querySelectorAll(" container-child-" + index)

      if (indexedChildren.length < 2) return;

      let span = document.createElement('span');


      Array.from(indexedChildren).forEach(element => {
        span.appendChild(element);

        const elementGridArea = (element as HTMLElement).style.gridArea.split(" / ");

        /*
        * getting parent's row and col from his children.
        * the very first row and col is the smallest one
        * and the last col and row which contains all children, is the biggest one
        */
        gettingGrids:
        rowStart = rowStart > parseInt(elementGridArea[0]) ? parseInt(elementGridArea[0]) : rowStart;
        colStart = colStart > parseInt(elementGridArea[1]) ? parseInt(elementGridArea[1]) : colStart;
        rowEnd = rowEnd < parseInt(elementGridArea[2]) ? parseInt(elementGridArea[2]) : rowEnd;
        colEnd = colEnd < parseInt(elementGridArea[3]) ? parseInt(elementGridArea[3]) : colEnd;


        const elementClassList = Array.from(element.classList).find(x => x.includes("container-child-"));
        const containerClass = elementClassList?.split("-")
        parentConfig = this.gridConfig.ElementConfig.find(x => x.parentId === parseInt(containerClass![2]))

      })

      this.relocateChildren(Array.from(indexedChildren))

      if (!parentConfig) return

      span.style.gridArea = "unset !important";
      span.style.gridArea = rowStart + " / " + colStart + " / " + rowEnd + " / " + colEnd;
      span.style.gridTemplateRows = 'repeat(' + (rowEnd - rowStart).toString() + ')';
      span.style.gridTemplateColumns = 'repeat(' + (colEnd - colStart).toString() + ')';

      span.classList.add("cy-container-parent")

      if (parentConfig.GroupId)
        span.classList.add("container-child-" + parentConfig.GroupId)

      allMother.appendChild(span);

      this.handleGenerator(span, [HandleXEnum.right, HandleXEnum.bottom], parentConfig ? parentConfig.Resizable : HandleDisplayEnum.none)
    });

  }
  /*
  * when you create a parent and add children inside, their grid address (gridArea) goes wrong
  * cuz the original address is for allMother grid system 
  * they have to start from 1 in the column and rom
  * 
  * example:
  * child1[6,6,7,7], child2[6,7,7,8]
  * * when they go to new parent zone, they have to be:
  * child1[1, 2,2,21, child2[1,2,2,3]
  */
  relocateChildren(children: Element[]) {

    // rowStarterChildren is a list for children which their gridRowStart is the smallest
    // this was a bug which resolved (wrong starting point for children)
    let rowStarterChildren = [];


    // colStarterChildren is a list for children which their gridColumnStart is the smallest
    // this was a bug which resolved (wrong starting point for children)
    let colStarterChildren = [];

    // result: min value of gridRowStart of the elements
    const rowStartMinValue = Math.min(...children.map(element => parseInt((element as HTMLElement).style.gridArea.split(" / ")[0])));
    rowStarterChildren = children.filter(element => parseInt((element as HTMLElement).style.gridArea.split(" / ")[0]) == rowStartMinValue)

    // result: min value of gridColumnStart of the elements
    const colStartMinValue = Math.min(...children.map(element => parseInt((element as HTMLElement).style.gridArea.split(" / ")[1])))
    colStarterChildren = children.filter(element => parseInt((element as HTMLElement).style.gridArea.split(" / ")[1]) == colStartMinValue)

    const mergedList = new Set([...rowStarterChildren, ...colStarterChildren]);
    mergedList.forEach(start => {

      let smallGrid = (start as HTMLElement).style.gridArea.split(" / ").map(val => { return parseInt(val) });
      /*
      * grid area has 4 parts:
      * gridRonStart:
      *
      * gridColumnStart: (the original start) - (min value) + 1
      * gridRowEnd:(the original ending) - (min value) + 1
      * gridColumnEnd:(the original ending) - (min value) + 1
      */
      (start as HTMLElement).style.gridArea = (smallGrid[0] - rowStartMinValue + 1) + " / " + (smallGrid[1] - colStartMinValue + 1) + " / "
        + (smallGrid[2] - rowStartMinValue + 1) + " / " + (smallGrid[3] - colStartMinValue + 1)
    })


  }



















  /*
  * can be a function
  * returns unique values if you use it in filter:
  * e.g. arrayInstance. filter(this.onlyUnique)
  * e.g. [8, 1, 1, 1, 2, 3, 3, 5, 5, 10] -> [8, 1, 2, 3, 5, 10] (no reordering)
  */
  onlyUnique(value: any, index: any, array: any[]) {
    return array.indexOf(value) == index
  }

  /*
  * get elementConfigs which contains group configs(row or col) and returns a list of them
  * e.g: [1, 1, 1, 2, 3, 3, 5, 5, 10]
  */
  getGroups(): any[] {
    let groupedElements = this.gridConfig.ElementConfig.filter(x => x.GroupId);
    let groupValues: any[] = [];
    groupedElements.forEach(element => groupValues.push(element.GroupId ? element.GroupId : element.GroupId))

    return groupValues
  }

  /*
  * handle generator only generate handle for one type; if parents are available, children has no handle
  * generating the handles of the elements (resizers)
  * className: e.g. ['right',"bottom'"]
  * type: differnece between child handles and parent are in their resize method, so check the switch below.
  */
  handLeGenerator(element: Element, className: string[], permission: HandleDisplayEnum) {

    let right = document.createElement("span")
    right.classList.add(className[0])
    right.classList.add('op-0')
    let bottom = document.createElement("span")
    bottom.classList.add(className[1])
    bottom.classList.add('op-0')


    const verticalMouseKeyDown$ = fromEvent(right, 'mousedown'),
      horizontalMouseKeyDown$ = fromEvent(bottom, "mousedown")

    this.subscription.add(verticalMouseKeyDown$.subscribe(e => {
      this.HandlerMover(e as MouseEvent, right)
    }))
    this.subscription.add(horizontalMouseKeyDown$.subscribe(e => {
      this.HandlerMover(e as MouseEvent, bottom)
    }))

    
  }
}

switch (permission) {
case undefined:
case HandleDisplayEnum. all: ( element . appendChild (right)
element.appendChild (bottom)
break:
case HandleDisplayEnum.y: (
element. appendChild(bottom)
break;
case HandleDisplayEnum.x: {
element. appendChild(right)
break;
case HandleDisplayEnum. none:
default:
break;
/*
* this method makes the handle move freely in the page
* called from 'handleGenerator' as mouse key down event
* 50, e == key down mouse event and handle our Handle :)
* /
Handlerflover(e: MouseEvent, handle: HIMLELement) {
let moveSubs = new SubscriptionO;
const allMother a this .Alliother. nativeElement as HTMLELement
const move$ = fromEvent (document, 'mousemove')
handle.classList.remove('op-0')
moveSubs.add(move$.subscribe(move => {
switch Chandle.classList.contains('right")) {
I
case true: {
const child = (e.target as HTMLELement) .parentElLement.get BoundingCLientRectO.x;
handle.style.left = ((move as MouseEvent).clientX - childX) + 'px*
break;
case false: (
const navHeight = parseInt (getComputedStyle(document .querySelector(" , ray-navbar-home")) .height.replace("px", ""))
const childy = (e.target as HITMLElement).parentELement. getBoundingCLIentRectO.y;
const gap = getComputedStyle (allMother),gap
handle.style. top - ((move as MouseEvent).clientY - navleight - childY + parseInt (gap) + 2) + 'px* break;



