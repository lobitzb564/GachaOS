import json
import re

"""Total threads
Total processes
CPU graph
Get temperature 
Per Each:
  CPU%,CPU Time,GPU%, GPU Time, PID, User, Memory, Energy use, Networks
"""
  
if __name__ == "__main__":
  with open("test.txt") as f:
    file_contents = f.readlines()
  final_dict = {}
  final_dict["Num_processes"] = int(re.search(r"([0-9]) total", file_contents[1]).groups()[0])
  final_dict["Num_threads"] = int(re.search(r"([0-9]*) threads", file_contents[1]).groups()[0])
  final_dict["total_cpu_percentage"] = int(re.search(r"CPU Usage: ([0-9]*)", file_contents[2]).groups()[0])
  final_dict["mem_free"] = int(re.search(r"([0-9.]*) free", file_contents[3]).groups()[0])
  final_dict["mem_used"] = int(re.search(r"([0-9.]*) used", file_contents[3]).groups()[0])+ int(re.search(r"([0-9.]*) buff/cache", file_contents[3]).groups()[0])
  file_contents = file_contents[7:]

  application_list = []
  for line in file_contents:
    temp_dict = {}
    vals = [char for char in line.split(" ") if char!= " "]
    pid = val
    #DO THE REST
    application_list.append(temp_dict)
  
    
