import { heroes } from '../data/heroes'; // 引入之前那个127个英雄的文件

// 这是一个“加工厂”，把英雄列表转换成你想要的“标签列表”
export const createTagIndex = () => {
  const tagMap = {};
  const positionMap = {};

  heroes.forEach(hero => {
    // 1. 处理分路 (Positions)
    hero.positions.forEach(pos => {
      if (!positionMap[pos]) {
        positionMap[pos] = [];
      }
      positionMap[pos].push(hero);
    });

    // 2. 处理标签 (Tags)
    hero.tags.forEach(tag => {
      if (!tagMap[tag]) {
        tagMap[tag] = [];
      }
      tagMap[tag].push(hero);
    });
    
    // 3. 处理职业 (Classes) - 如果需要
    hero.classes.forEach(cls => {
        // 同理...
    });
  });

  return {
    byPosition: positionMap, // { jungle: [马超, 澜...], roam: [孙膑...] }
    byTag: tagMap            // { control: [东皇...], sustain: [蔡文姬...] }
  };
};

// 导出生成好的索引
export const { byPosition, byTag } = createTagIndex();