import { UntypedFormGroup } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { arisEnum, ContainerDisplayllode, HandleDisplayEnun, HandlexEnum, HandleVEnum } from " . /models/container. enum";
import { ElementConfig, IGridConfig } from './models/grid-config-interface';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'grid';

  public basics: any;



  private subscription: Subscription = new Subscription;





















































  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @ViewChild('allMother', { static: true }) AlMother: ElementRef;
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










}