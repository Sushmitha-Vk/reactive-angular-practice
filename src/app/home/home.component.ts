import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { CourseService } from '../services/course.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(private http: HttpClient, private courseService: CourseService) {

  }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    const courses$ = this.courseService.loadAllCourses()
      .pipe(
        map(res => res.sort(sortCoursesBySeqNo))
      );
    this.beginnerCourses$ = courses$.pipe(
      map(res => res.filter(course => course.category === 'BEGINNER'))
    );
    this.advancedCourses$ = courses$.pipe(
      map(res => res.filter(course => course.category === 'ADVANCED'))
    );
  }

}




