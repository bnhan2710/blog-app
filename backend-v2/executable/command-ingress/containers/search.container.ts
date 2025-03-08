import { Container } from 'inversify';
import { ISearchService } from '../features/search/types';
import { DI_TOKENS } from '../types/di/DiTypes';
import { SearchController } from '../features/search/adapter/controller';
import { SearchServiceImpl } from '../features/search/domain/service';

const SearchDIContainer: Container = new Container();

// Binding
SearchDIContainer.bind<ISearchService>(DI_TOKENS.SEARCH_SERVICE).to(SearchServiceImpl).inSingletonScope();

SearchDIContainer.bind<SearchController>(SearchController).toSelf();

const searchController = SearchDIContainer.get<SearchController>(SearchController);

// Export module

export { searchController, SearchDIContainer };