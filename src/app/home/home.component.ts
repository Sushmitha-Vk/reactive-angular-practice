import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { CourseService } from '../services/course.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(private courseService: CourseService, private loadingService: LoadingService, private messageService: MessagesService) {

  }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    this.loadingService.loadingOn();
    const courses$ = this.courseService.loadAllCourses()
      .pipe(
        map(res => res.sort(sortCoursesBySeqNo)),
        catchError(err =>{
          const message = 'Error in loading course';
          this.messageService.showErrors(message);
          return throwError(err);
        })
      );
    const loading$ = this.loadingService.showLoaderUntilComplete(courses$);
    this.beginnerCourses$ = loading$.pipe(
      map(res => res.filter(course => course.category === 'BEGINNER'))
    );
    this.advancedCourses$ = loading$.pipe(
      map(res => res.filter(course => course.category === 'ADVANCED'))
    );
  }

}




