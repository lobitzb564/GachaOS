#!/usr/bin/python3
import matplotlib.pyplot as plt
import argparse
import numpy as np

def make_arr (string):
    string = string[1:]
    string = string [:-1]
    string = list(string)
    ret_arr = []
    temp_str = ""
    for char in string:
      if char != ",":
        temp_str+= char
      elif char == "," and len(temp_str) > 0:
        ret_arr.append(temp_str)
        temp_str = ""
        continue
    ret_arr.append(temp_str)
    return ret_arr
if __name__ == "__main__":
  arg_parser = argparse.ArgumentParser()
  arg_parser.add_argument("--data-points", default ="[20,23,10,56]")
  arg = arg_parser.parse_args()
  y_axis = make_arr(arg.data_points)
  y_axis = list(map(int, y_axis))
  x_axis= [i for i in range (1,len(y_axis)+1)]
  x = np.arange(len(x_axis))
  fig = plt.figure()
  fig.patch.set_facecolor("#2a144f")
  plt.rcParams['axes.facecolor'] = "#2a144f"
  plt.rcParams["text.color"] = "04d66d"
  ax = fig.add_subplot()
  ax.spines['left'].set_color('silver')
  ax.spines['right'].set_color('silver')
  ax.spines['top'].set_color('silver')
  ax.spines['bottom'].set_color('silver')
  
  plt.plot(x_axis,y_axis, color="#04d66d")
  plt.xticks([])
  plt.yticks([i*10 for i in range (0,11)], [str(i*10) for i in range (0,11)], color = "#04d66d")
  plt.title('CPU percentage')
  plt.grid(True)
  plt.savefig("Downloads/cpu_graph.jpeg",dpi=300)
