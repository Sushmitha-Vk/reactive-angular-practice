import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({
    providedIn: 'root'
})
export class CourseStore {
    private subject = new BehaviorSubject<Course[]>([]);
    course$: Observable<Course[]> = this.subject.asObservable();

    constructor(
        private http: HttpClient,
        private loadingService: LoadingService,
        private messagesService: MessagesService) {
        this.loadCourses();
    }

    private loadCourses() {
        const loadingCourses$ = this.http.get<Course[]>('/api/courses').pipe(
            map(response => response['payload']),
            catchError((error) => {
                const message = 'Could not load courses';
                this.messagesService.showErrors(message);
                return throwError(error);
            }),
            tap(courses => this.subject.next(courses))
        );
        this.loadingService.showLoaderUntilComplete(loadingCourses$)
            .subscribe();
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        const courses = this.subject.getValue();
        const index = courses.findIndex(course => course.id === courseId);
        const newCourse: Course = {
            ...courses[index],
            ...changes
        };

        const newCourses: Course[] = courses.splice(0);
        newCourses[index] = newCourse;
        this.subject.next(newCourses);

        return this.http.put(`/api/courses/${courseId}`, changes).pipe(
            catchError(err => {
                const message = 'Could not save the changes';
                this.messagesService.showErrors(message);
                return throwError(err);
            }),
            shareReplay()
        )
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.course$.pipe(
            map(courses => courses.filter(course => course.category === category)
                .sort(sortCoursesBySeqNo)
            )
        )
    }
}