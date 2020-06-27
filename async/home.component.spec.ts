import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  tick,
  flushMicrotasks,
  TestBed,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "../services/courses.service";
import { HttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let courseService: any;
  let el: DebugElement;

  const beginnerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );

  const advancedCourses = setupCourses().filter(
    (course) => course.category == "ADVANCED"
  );

  beforeEach(async(() => {
    const courserServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);
    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [
        {
          provide: CoursesService,
          useValue: courserServiceSpy,
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        courseService = TestBed.get(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    courseService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "unexpected no of tabs");
  });

  it("should display only advanced courses", () => {
    courseService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "unexpected no of tabs");
  });

  it("should display both tabs", () => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2, "unexpected no of tabs");
  });

  it("should display advanced courses when tab clicked with fakeAsync", fakeAsync(() => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]);

    fixture.detectChanges();

    flush();
    fixture.detectChanges();
    const cardTitle = el.queryAll(By.css(".mat-card-title"));
    expect(cardTitle.length).toBeGreaterThan(0, "cound not find card title");
    expect(cardTitle[0].nativeElement.textContent).toContain(
      "Angular Security Course - Web Security Fundamentals"
    );
  }));

  it("should display advanced courses when tab clicked  with async", async(() => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const cardTitle = el.queryAll(By.css(".mat-card-title"));
      expect(cardTitle.length).toBeGreaterThan(0, "cound not find card title");
      expect(cardTitle[0].nativeElement.textContent).toContain(
        "Angular Security Course - Web Security Fundamentals"
      );
    });
  }));
});
