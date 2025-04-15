# Biographica Protein Info
Web application designed to search, visualise, and explore protein data from a biological knowledge graph.

<small>April 2025: ~5hrs</small>

## Running Application

- Clone Repository
- Go to backend

``` 
cd backend 
```

- install deps

```
poetry install --no-root
```

- Start the api (using uvicorn)

```
poetry run uvicorn app:app --reload --host 0.0.0.0 --port 8000 
```

- Go to frontend

```
cd ../frontend
```

- Install dependencies (with yarn)

```
yarn
```

- Start frontend

```
yarn dev
```


## Next Steps

### Overall
- Dockerise the app. Currently specififying host info in the poetry run command for easy connection when using containerisation but didnt get round to implementing

### Backend

Tidy up:
- modularise and separate out the data_service class into smaller classes for separation of concerns
- there's some reused code - extract into helper function (or static method)

Optimise Search, options:
- Introduce indexing to datadrames
- Load everthing into a sqlite db instead of in memory pandas
- caching
- potentially fuzzy matching for go terms etc

### Frontend

Fe is okay/basic, just pieced together with mui. Still would add some changes:
- Nav doesnt always work when trying to 'go back' several times, would edit behaviour
- add pagination to FAnnotations (like protein-protein interactions)

#### Nice to haves

Having a renderer for the proteins would be very cool. There's one I use for CRYO-em data written in house, but implementing would take too long currently for refactoring into react component.
