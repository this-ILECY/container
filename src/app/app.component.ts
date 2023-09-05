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

    switch (permission) {
      case undefined:
      case HandleDisplayEnum.all: {
        element.appendChild(right)
        element.appendChild(bottom)

        break;
      }
      case HandleDisplayEnum.y: {
        element.appendChild(bottom)

        break;
      }
      case HandleDisplayEnum.x: {
        element.appendChild(right)

        break;
      }

      case HandleDisplayEnum.none:
      default:
        break;
    }
  }

  /*
  * this method makes the handle move freely in the page
  * called from 'handleGenerator' as mouse key down event
  * 50, e == key down mouse event and handle our Handle :)
  */
  Handlerflover(e: MouseEvent, handle: HTMLElement) {

    let moveSubs = new Subscription();

    const allMother = this.AllMother.nativeElement as HTMLElement;

    const move$ = fromEvent(document, 'mousemove')

    handle.classList.remove('op-0')

    moveSubs.add(move$.subscribe(move => {

      switch (handle.classList.contains('right')) {
        case true: {

          const childX = (e.target as HTMLElement).parentElement!.getBoundingClientRect().x;
          handle.style.left = ((move as MouseEvent).clientX - childX) + 'px';
          break;
        }
        case false: {
          const navHeight = parseInt(getComputedStyle(document.querySelector(" , ray-navbar-home")!).height.replace("px", ""))
          const childY = (e.target as HTMLElement).parentElement!.getBoundingClientRect().y;
          const gap = getComputedStyle(allMother).gap
          handle.style.top = ((move as MouseEvent).clientY - navHeight - childY + parseInt(gap) + 2) + 'px'

          break;
        }

        default:
          break;
      }
    }))

    const keyUp$ = fromEvent(document, 'mouseup')

    this.subscription.add(keyUp$.pipe(take(1)).subscribe(() => {

      this.NeighborInteractIon((e.target as HTMLElement))

      handle.classList.add('op-0')

      handle.style.left = 'unset'
      handle.style.top = 'unset'


      moveSubs.unsubscribe()
    }))
  }

  /*
  * the sizing manager of non - dashboard container
  * it needs only the handle you dragged and caused the interaction 
  */
  NeighborInteractIon(handle: HTMLElement) {

    let distance;
    let gridArea;
    let child = handle.parentElement;

    switch (handle.classList.contains('right')) {
      case true: {
        //distance here is space between handle and right side of its child 
        distance = this.HandleDistanceCalculator(handle, AxisEnum.x);
        distance = this.PixelToCel(distance, AxisEnum.x)

        //i get the gridArea of the child here and modify the 'gridColumnEnd value by adding the distance
        gridArea = getComputedStyle(child!).gridArea.split(" / ")
        gridArea[3] = (parseInt(gridArea[3]) + distance).toString();

        /*
        * gridArea[1]: starting column
        * gridArea[3]: ending column
        * 
        * so:
        * If the starting column is equal or bigger than ending column, it means you are moving the handle further than the size of the child. 
        */
        if (parseInt(gridArea[1]) >= parseInt(gridArea[3])) gridArea[3] = (parseInt(gridArea[1]) + 1).toString()

        let neighbor = this.GetNeighbor(child!, AxisEnum.x);

        if (!neighbor) return

        let neighborGridArea = getComputedStyle(neighbor).gridArea.split(" / ")

        /*
        * watch this carefully:
        *
        * neighbor is in the right side of the child.
        * so:
        * gridColStart of the neighbor = gridColEnd of the child
        */
        this.ResizeGridArea(neighbor, [neighborGridArea[0], gridArea[3], neighborGridArea[2], neighborGridArea[3]])
        break;
      }
      case false: {
        //distance here is space between handle and bottom side of its child
        distance = this.HandleDistanceCalculator(handle, AxisEnum.y);
        distance = this.PixelToCel(distance, AxisEnum.y);

        //i get the gridArea of the child here and modify the 'gridRowEnd' value by adding the distance
        gridArea = getComputedStyle(child!).gridArea.split(" / ");
        gridArea[2] = (parseInt(gridArea[2] + distance)).toString();

        /*
        * gridArea[0]: starting row
        * gridArea[2]: ending row
        *
        * so:
        * if the starting row is equal or bigger than ending row, it means you are moving the handle further than the size of the child.
        */
        if (parseInt(gridArea[0]) >= parseInt(gridArea[2])) gridArea[2] = (parseInt(gridArea[0]) + 1).toString()

        let neighbor = this.GetNeighbor(child!, AxisEnum.y);

        if (!neighbor) return

        let neighborGridArea = getComputedStyle(neighbor).gridArea.split(" / ")

        /*
        * watch this carefully:
        * neighbor is in the bottom side of the child.
        * 
        * SO:
        * gridRowStart of the neighbor = gridRomEnd of the child
        */
        this.ResizeGridArea(neighbor, [gridArea[2], neighborGridArea[1], neighborGridArea[2], neighborGridArea[3]])
        break;
      }

      default:
        break;
    }

    this.ResizeGridArea(child, gridArea);
  }

  /*
* after any resize, other neighbors must interact;
* this method returns the neighbor
* just give her the resized child.
*/
  GetNeighbor(child: HTMLElement, axis: AxisEnum): any {
    let parent = child.parentElement
    let childGridArea = getComputedStyle(child).gridArea.split(" / ")

    let neighbor;

    switch (axis) {
      case AxisEnum.x: {
        neighbor = Array.from(parent!.children).find(x => (getComputedStyle(x).gridRowStart) == childGridArea[0] && getComputedStyle(x).gridColumnStart == childGridArea[3])
        break;
      }
      case AxisEnum.y: {
        neighbor = Array.from(parent!.children).find(x => getComputedStyle(x).gridRowStart == childGridArea[2] && getComputedStyle(x).gridColumnStart == childGridArea[1])
        break;
      }
      default:
        break;
    }

    return neighbor;


  }

  /*
  * give it the element and grid area
  * expanding or collapsing the child and its neighbors is the main resposibility of this method
  */
  ResizeGridArea(element: HTMLElement, gridArea: any) {
    element.style.gridArea = gridArea[0] + " / " + gridArea[1] + " / " + gridArea[2] + " / " + gridArea[3]
  }

  /*
  * calculating the distance between handle and its parent
  * just give the handle to it
  * returns in pixels.
  */
  HandLeDistanceCalculator(handle: HTMLElement, axis: AxisEnum) {
    let parent = handle.parentElement

    let parentSize;
    let parentoffset;
    let handleOffset;

    switch (axis) {
      case AxisEnum.x: {
        parentSize = parseInt(getComputedStyle(parent!).width.replace("px", ""))
        handleOffset = parseInt(getComputedStyle(handle).left.replace("px", ""))
        parentoffset = parent!.getBoundingClientRect().x
        break;
      }
      case AxisEnum.y: {
        handleOffset = parseInt(getComputedStyle(handle).top.replace("px", ""))
        parentSize = parseInt(getComputedStyle(parent!).height.replace("px", ""))
        parentoffset = parent!.getBoundingClientRect().y
        break;
      }
    }
  }
}











