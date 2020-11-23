import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Item } from '../models/item';
import { PaginatedResponse } from '../wrappers/paginated-response';
import { DataService } from './data.service';
import { environment } from 'src/environments/environment';

describe('DataService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let dataService: DataService<Item>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService],
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    dataService = new DataService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(dataService).toBeTruthy();
  });

  // =========================================================================
  // Test suite => Get
  // =========================================================================

  describe('#get', () => {
    const testUrl = `${environment.apiUrl}/items/5fa737485a239e22c476659f`;

    it('should get a single instance of an Item', () => {
      const testItem = new Item({
        title: 'Test the data service',
        list: '5fa737395a239e22c4766598',
      });

      dataService
        .get('/items/5fa737485a239e22c476659f')
        .subscribe((res: Item) => {
          expect(res).toEqual(testItem);
        });

      // The following `expectOne()` will match the request's URL.
      // If no requests or multiple requests matched that URL
      // `expectOne()` would throw.
      const req = httpTestingController.expectOne(testUrl);

      // Assert that the request is a GET.
      expect(req.request.method).toEqual('GET');

      // Respond with mock data, causing Observable to resolve.
      // Subscribe callback asserts that correct data was returned.
      req.flush(testItem);
    });
  });

  // =========================================================================
  // Test suite => GetAll
  // =========================================================================

  describe('#getAll', () => {
    it('should get a single instance of an Item', () => {
      const testItems = [
        new Item({
          title: 'Test the data service',
          list: '5fa737395a239e22c4766598',
        }),
        new Item({
          title: 'Test it again',
          list: '5fa737395a239e22c4766598',
        }),
      ];

      const testResponse = new PaginatedResponse(0, 30, 2, testItems);
      dataService
        .getAll('/items')
        .subscribe((res: PaginatedResponse<Item>) =>
          expect(res).toEqual(testResponse)
        );

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/items`
      );

      expect(req.request.method).toEqual('GET');
      req.flush(testResponse);
    });
  });

  // =========================================================================

  describe('#create', () => {
    it('should create a new Item', () => {
      const testItem = new Item({
        title: 'Test the data service',
        list: '5fa737395a239e22c4766598',
      });

      dataService
        .create('/items', testItem)
        .subscribe((res: Item) => expect(res).toEqual(testItem));

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/items`
      );

      expect(req.request.method).toEqual('POST');
      req.flush(testItem);
    });
  });

  // =========================================================================

  describe('#update', () => {
    it('should update a new Item', () => {
      const testItem = new Item({
        _id: '5fa737485a239e22c476659f',
        title: 'Test the data service',
        list: '5fa737395a239e22c4766598',
      });

      const path = '/items/5fa737485a239e22c476659f';

      dataService
        .update(path, testItem)
        .subscribe((res: Item) => expect(res).toEqual(testItem));

      const req = httpTestingController.expectOne(environment.apiUrl + path);

      expect(req.request.method).toEqual('PUT');
      req.flush(testItem);
    });
  });

  // =========================================================================

  describe('#remove', () => {
    it('should remove  new Item', () => {
      const path = '/items/5fa737485a239e22c476659f';

      dataService
        .remove(path)
        .subscribe();

      const req = httpTestingController.expectOne(environment.apiUrl + path);

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.body).toBeNull();
    });
  });

  // =========================================================================
});
