import React from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, ScrollView, ActivityIndicator, Image, TouchableOpacity, Linking, TouchableWithoutFeedback, RefreshControl, Animated, Easing } from 'react-native';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Page = () => {

  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [openHC3, setOpenHC3] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const getData = async () => {
    try {
      const response = await fetch('https://run.mocky.io/v3/04a04703-5557-4c84-a127-8c55335bb3b4');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    Animated.timing(
      new Animated.Value(0),
      { 
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.linear,
        duration: 3000,
      }
    ).start();
  }, []);

  function replaceJSX(str, find, replace) {
    const parts = str.split(find);
    const result = [];
    for(let i = 0; i < parts.length; i++) {
        result.push(parts[i]);
        if (i < parts.length - 1)
          result.push(replace);
    }
    return result;
  }

  function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }  
  }
  
  return (
    <>
      { isLoading ? <ActivityIndicator /> :
      <ScrollView
      // contentContainerStyle={{  }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >
        <StatusBar style="auto" />
        <Text style={styles.heading}>fampay</Text>
        <View style={styles.main}>
          {data.card_groups.sort(sortByProperty("id")).map((index) => {
            return (
// design type of HC6
              index.design_type === 'HC6' ?
              <>
              <Text style={styles.heads}>{index.name}</Text>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{width: '100%', }}>
              {
                index.cards.map((card) => {
                  return (
                    <TouchableOpacity
                      key={index.id} 
                      style={{width: '100%'}}
                      onPress={() => {
                        Linking.openURL(card.url);
                      }}
                    >
                      <View style={styles.hc6_card}>
                        <Image
                          style={{height: 40, width: 40}}
                          source={{uri: card.icon.image_url}}
                        />
                        <View style={{flexDirection: 'column', marginLeft: 10}}>
                          <Text style={styles.hc6_title}>{replaceJSX(
                            card.formatted_title.text, "{}", 
                            <Text
                              style={{
                                color: card.formatted_title.entities[0].color
                              }}
                            >{card.formatted_title.entities[0].text}</Text>
                            )}
                          </Text>
                          <Text style={styles.hc6_description}>{replaceJSX(
                            card.formatted_description.text, "{}",
                            <Text
                              style={{
                                color: card.formatted_description.entities[0].color
                              }}
                            >{card.formatted_description.entities[0].text}</Text>
                          )}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                }
              )}
              </ScrollView> 
              </>:
// design type of HC9
              index.design_type === 'HC9' ?
                <View style={{display: 'flex', marginTop: 10, width: '100%'}}>
                <Text style={styles.heads}>{index.name}</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{width: '100%', }}>
                {index.cards.map((card) => {
                  return (
                    <TouchableOpacity
                      key={card.name}
                      style={{height: index.height, marginHorizontal: 10}}
                      onPress={() => {
                        Linking.openURL(card.url);
                      }}
                    >
                      <Image
                      style={{aspectRatio: card.bg_image.aspect_ratio, height: '100%', width: '100%'}}
                        source={{uri: card.bg_image.image_url}}
                      />
                    </TouchableOpacity>
                  )
                })}
                </ScrollView> 
              </View> :
// design type of HC1  
              index.design_type === 'HC1' ?
                <>
                <Text style={styles.heads}>{index.name}</Text>
                {
                  index.is_scrollable ? 
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{width: '100%', }}>
                      {index.cards.map((card) => (
                        <TouchableOpacity
                          style={{width: '70%'}}
                          onPress={() => {
                            Linking.openURL(card.url);
                          }}
                        >
                          <View style={[styles.hc1_card, {backgroundColor: card.bg_color}]}>
                            <Image
                              style={{height: 40, width: 40, aspectRatio: card.icon.aspect_ratio}}
                              source={{uri: card.icon.image_url}}
                            />
                            <View style={{flexDirection: 'column', marginLeft: 10}}>
                              <Text style={styles.hc6_title}>{card.title}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                   :
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    {index.cards.map((card) => (
                      <TouchableOpacity
                        style={{width: '48%'}}
                        onPress={() => {
                          Linking.openURL(card.url);
                        }}
                      >
                        <View style={[styles.hc1_card, {backgroundColor: card.bg_color}]}>
                          <Image
                            style={{height: 40, width: 40, aspectRatio: card.icon.aspect_ratio}}
                            source={{uri: card.icon.image_url}}
                          />
                          <View style={{flexDirection: 'column', marginLeft: 10}}>
                            <Text style={styles.hc6_title}>{card.title}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                }</> :
// design type of HC5 
              index.design_type === 'HC5' ? 
                <>
                  <Text style={styles.heads}>{index.name}</Text>
                  <View style={{ width: '100%', flexDirection: 'row', display: 'flex'}}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{width: '100%', }}>
                      {index.cards.map((card) => {
                        return (
                          <TouchableOpacity
                            key={card.name}
                            onPress={() => { Linking.openURL(card.url); }}
                          >
                            <View style={[styles.hc5_card, {backgroundColor: card.bg_color}]}>
                              <Image
                                style={{ height: 280, width: 280, aspectRatio: card.bg_image.aspect_ratio}}
                                source={{uri: card.bg_image.image_url}}
                              />
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                  </View>
                </> :
// design type of HC3
              index.design_type === 'HC3' ?
              <>
                <Text style={styles.heads}>{index.name}</Text>
                <View style={{ width: '100%', flexDirection: 'row', display: 'flex'}}>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{width: '100%', }}>
                    {index.cards.map((card) => {
                      return (
                        <TouchableWithoutFeedback
                        onPress={() => { Linking.openURL(card.url); }}
                        onLongPress={() => {setOpenHC3(true)} }
                        style={{width: '100%', height: 320}}>
                          <View
                            style={{width: '100%', height: 320, borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden'}}
                          >
                            <View style={{position: 'absolute', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                              <TouchableOpacity style={{height: 80, backgroundColor: '#f7f6f3', width: 100, borderRadius: 16, padding: 8, marginTop: 10, marginLeft: 20, alignItems: 'center', justifyContent: 'flex-end'}}>
                                <Text>remaind later</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => {setOpenHC3(false)}} style={{height: 80, backgroundColor: '#f7f6f3', width: 100, borderRadius: 16, padding: 8, marginTop: 10, marginLeft: 20, alignItems: 'center', justifyContent: 'flex-end'}}>
                                <Text>dismiss now</Text>
                              </TouchableOpacity>
                            </View>
                              <Animated.View 
                              style={[
                                styles.hc3_card, 
                                {backgroundColor: card.bg_color,
                                transform: [
                                  { translateX: openHC3 ? 150 : 0 },
                                  { perspective: 1000 },
                                ]
                                }
                              ]}>
                                <Image 
                                  style={{height: '90%', width: '90%', aspectRatio: card.bg_image.aspect_ratio, position: 'absolute', top: 20, left: 0}}
                                  source={{uri: card.bg_image.image_url}}
                                />
                                <View style={{flexDirection: 'column', marginLeft: 10}}>
                                  <Text style={styles.hc3_title}>{replaceJSX(
                                    card.formatted_title.text, "{}", 
                                    <Text
                                      style={{
                                        color: card.formatted_title.entities.map((i) => { return i.color })
                                      }}
                                    >{card.formatted_title.entities.map((i) => { return i.text})}</Text>
                                  )}
                                  </Text>
                                  <Text style={styles.hc3_description}>{card.description}</Text>
                                  {card.cta.map((btn) => {
                                    return (
                                      <TouchableOpacity
                                        style={{backgroundColor: btn.bg_color, borderRadius: 8, padding: 12, marginTop: 20, width: 100, alignItems: 'center'}}
                                        onPress={() => { Linking.openURL(btn.url); }}
                                      >
                                        <Text style={{color: btn.text_color}}>{btn.text}</Text>
                                      </TouchableOpacity>
                                    )
                                  })}
                                </View>
                              </Animated.View>
                            </View>
                        </TouchableWithoutFeedback>
                      )
                    })}
                  </ScrollView>
                </View>
              </> : <Text>Nothing</Text>
            )
          })}
        </View>
      </ScrollView>
      }
    </>
  );
}

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  main: { 
    flex: 1,
    backgroundColor: '#f7f6f3',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    color: '#464646',
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? 35 : 0,
    alignSelf: 'center',
  },
  heads: {
    fontSize: 18,
    color: '#464646',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingVertical: 10,
  },
  hc6_card: {
    display: 'flex',
    height: 80,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 14,
    alignItems: 'center',
    padding: 10,
  },
  hc1_card: {
    display: 'flex',
    height: 80,
    flexDirection: 'row',
    width: '100%',
    borderRadius: 14,
    alignItems: 'center',
    padding: 10,
    margin: 5
  },
  hc5_card: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 14,
    alignItems: 'center',
    // padding: 10,
    margin: 5,
    overflow: 'hidden',
  },
  hc3_card: {
    display: 'flex',
    height: "100%",
    flexDirection: 'column',
    borderRadius: 14,
    alignItems: 'flex-start',
    padding: 10,
  },
  hc6_title: {  
    fontSize: 16,
    color: '#464646',
    fontWeight: 'bold',
  },
  hc3_title: {  
    fontSize: 26,
    color: '#464646',
    fontWeight: 'bold',
    width: 300,
    marginTop: 110
  },
  hc6_description: {
    fontSize: 14,
    color: '#727272',
    marginTop: 5
  },
  hc3_description: {
    fontSize: 16,
    color: '#545454',
    marginTop: 20,
    width: 280,
  },
});
