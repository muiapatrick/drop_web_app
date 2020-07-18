import { Injectable } from '@angular/core';
import { SocketClientService } from './socket-client.service';
import { Observable } from 'rxjs';
import { PostListing } from 'src/app/_models/post-listing';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private socketClient: SocketClientService) { }

  // findAll(): Observable<string> {
  //   return this.socketClient.onMessage('/topic/messages')
  //     .pipe(first(), map(posts => posts.map(PostService.getPostListing)));
  // }

  // static getPostListing(post: any): string {
  //   const postedAt = new Date();
  //   return {...post, postedAt};
  // }

  // findAll(): Observable<PostListing[]> {
  //   return this.socketClient.onMessage('/topic/posts/get')
  //     .pipe(first(), map(posts => posts.map()))
  // }

  // static getPostListing(post: any): String {
  //   const postedAt = new Date(post['postedAt']);
  //   return {...post, postedAt};
  // }
}
