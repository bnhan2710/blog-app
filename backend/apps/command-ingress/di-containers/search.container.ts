import { Container } from 'inversify';
import { ISearchService } from '../modules/search/types';
import { DI_TOKENS } from '../shared/types/di-types';
import { SearchController } from '../modules/search/adapter/controller';
import { SearchServiceImpl } from '../modules/search/domain/service';

const SearchDIContainer: Container = new Container();

// Binding
SearchDIContainer.bind<ISearchService>(DI_TOKENS.SEARCH_SERVICE).to(SearchServiceImpl).inSingletonScope();

SearchDIContainer.bind<SearchController>(SearchController).toSelf();

const searchController = SearchDIContainer.get<SearchController>(SearchController);

// Export module

export { searchController, SearchDIContainer };