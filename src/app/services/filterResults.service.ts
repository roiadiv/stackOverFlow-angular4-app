import { Subject } from "rxjs/Subject";

export class FilterResultsService {
    
    constructor() {}
    
    onToggleFilterState: Subject<void> = new Subject<void>();
    onFilterResults: Subject<string> = new Subject<string>();

    
}