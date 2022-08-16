import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriesModelServer, ServerResponse } from '../models/categories.models';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) { }
  
  getAllCategories():Observable<CategoriesModelServer>{
    return this.http.get<CategoriesModelServer>(this.SERVER_URL + '/categories/');
  }

}
