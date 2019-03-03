import Id from "./id";
import Entity from "./entity";
import { generateId } from "./id";

abstract class Repo<T extends Entity> {
    protected abstract update(entity: T): Promise<any>;
    protected abstract insert(entity: T): Promise<any>;

    public abstract find(id: Id): Promise<T | null>;
    public abstract delete(entity: T): Promise<any>;

    public async save(entity: T): Promise<T> {
        if (entity.id) await this.update(entity);
        else {
            entity.id = generateId();
            await this.insert(entity);
        }
        return entity;
    }
}

export default Repo;
