import { CoursesService } from "./courses.service";
import { TestBed } from "@angular/core/testing";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
fdescribe("course service", () => {
    let courseService:CoursesService;
    let httptestingControler: HttpTestingController
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers:[CoursesService]
    })
    courseService = TestBed.get(CoursesService);
    httptestingControler = TestBed.get(HttpTestingController)
  });


  it("should retrive all courses", () => {
    courseService.findAllCourses()
    .subscribe(courses=>{
     expect(courses).toBeTruthy('no courses retured');
     expect(courses.length).toBe(12, 'incorrect no of courses')
     const course = courses.find(course=>course.id==12);
      expect(course.titles.description).toBe('Angular Testing Course')

    })
    const testReq= httptestingControler.expectOne('/api/courses')
    expect(testReq.request.method).toEqual("GET")
    testReq.flush({payload: Object.values(COURSES)})
  });


  it("find course by id", () => {
    courseService.findCourseById(12)
    .subscribe(course =>{
     expect(course).toBeTruthy('no courses retured');
    expect(course.id).toBe(12)

    })
    const testReq= httptestingControler.expectOne('/api/courses/12')
    expect(testReq.request.method).toEqual("GET")
    testReq.flush(COURSES[12])
    
  });


  it("should save data", () => {
    let changes:Partial<Course> = { titles: {
      description: 'Angular Testing'
    }}
    courseService.saveCourse(12, changes)
    .subscribe(course =>{
    expect(course.id).toBe(12)

    })
    const testReq= httptestingControler.expectOne('/api/courses/12')
    expect(testReq.request.method).toEqual("PUT")
    expect(testReq.request.body.titles.description).toEqual(changes.titles.description)
    testReq.flush({...COURSES[12], ...changes})
    
  });


  it("should give error if save data fails", () => {
    let changes:Partial<Course> = { titles: {
      description: 'Angular Testing'
    }}
    courseService.saveCourse(12, changes)
    .subscribe(course =>fail("save course operation fails"),
    (error:HttpErrorResponse)=>{
    expect(error.status).toBe(500)
    }
    )
    const testReq= httptestingControler.expectOne('/api/courses/12')
    expect(testReq.request.method).toEqual("PUT")
    testReq.flush('save course fail', {status:500, statusText:'internal server error'})  
  });


  it("get courses by params", () => {
    courseService.findLessons(12)
    .subscribe(lessons =>{
     expect(lessons).toBeTruthy('no lessions retured');
     expect(lessons.length).toBe(3)

    })
    const testReq= httptestingControler.expectOne(req=>req.url=='/api/lessons')
    expect(testReq.request.method).toEqual("GET")
    expect(testReq.request.params.get("courseId")).toEqual("12")
    expect(testReq.request.params.get("filter")).toEqual("")
    expect(testReq.request.params.get("pageNumber")).toEqual("0")
    expect(testReq.request.params.get("pageSize")).toEqual("3")
    expect(testReq.request.params.get("sortOrder")).toEqual("asc")
    testReq.flush({payload: findLessonsForCourse(12).slice(0,3)})
    
  });

afterEach(()=>{
  httptestingControler.verify();
})

});
