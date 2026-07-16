const sampleGraph = {
  nodes: [
    { id: "Industrial Brain", label: "Industrial Brain" },

    { id: "Predictive Maintenance", label: "Predictive Maintenance" },
    { id: "IoT Sensors", label: "IoT Sensors" },
    { id: "Machine Learning", label: "Machine Learning" },
    { id: "Anomaly Detection", label: "Anomaly Detection" },
    { id: "Failure Prediction", label: "Failure Prediction" },

    { id: "Maintenance Planning", label: "Maintenance Planning" },
    { id: "Safety Monitoring", label: "Safety Monitoring" },
    { id: "Dashboard", label: "Dashboard" },
    { id: "Reports", label: "Reports" },

    { id: "Vibration Sensor", label: "Vibration Sensor" },
    { id: "Temperature Sensor", label: "Temperature Sensor" },
    { id: "Pressure Sensor", label: "Pressure Sensor" },
    { id: "Alert System", label: "Alert System" },
    { id: "Maintenance Team", label: "Maintenance Team" }
  ],

  edges: [
    { source: "Industrial Brain", target: "Predictive Maintenance" },
    { source: "Industrial Brain", target: "Dashboard" },
    { source: "Industrial Brain", target: "Reports" },

    { source: "Predictive Maintenance", target: "IoT Sensors" },
    { source: "Predictive Maintenance", target: "Machine Learning" },

    { source: "Machine Learning", target: "Anomaly Detection" },
    { source: "Machine Learning", target: "Failure Prediction" },

    { source: "Failure Prediction", target: "Maintenance Planning" },

    { source: "IoT Sensors", target: "Vibration Sensor" },
    { source: "IoT Sensors", target: "Temperature Sensor" },
    { source: "IoT Sensors", target: "Pressure Sensor" },

    { source: "Safety Monitoring", target: "Alert System" },

    { source: "Maintenance Planning", target: "Maintenance Team" },

    { source: "Dashboard", target: "Safety Monitoring" }
  ]
};

export default sampleGraph;